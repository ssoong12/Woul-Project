from django.http import JsonResponse, HttpResponse
from bp_django.models import Word, UserWord, UserDialogue, User
from django.db.models import Avg, Count, F
import json
from django.db.models import Q
import collections
import functools
import operator
from collections import defaultdict
from object_detection.repository import findUserByInnerId
# Create your views here.

def return_all_scores():
    """
    모든 사용자의 발음 점수와 수집 단어 수를 반환하는 함수입니다.

    Returns:
        dict: 사용자별 발음 점수와 수집 단어 수 정보를 포함한 딕셔너리
    """
    # Get a list of dictionaries where each dictionary contains 'user' and their average 'pronunce_score'
    all_users_words = {item['user']: {'word_pronunce_score': item['word_pronunce_score']} for item in UserWord.objects.exclude(pronunce_score__isnull=True).values('user').annotate(word_pronunce_score = Avg('pronunce_score'))}
    all_users_dialogue = {item['user']: {'dialogue_pronunce_score': item['dialogue_pronunce_score']} for item in UserDialogue.objects.values('user').annotate(dialogue_pronunce_score = Avg('pronunce_score'))}
    
    # Combine the two dicts
    for user_id, dialogue_score in all_users_dialogue.items():
        if user_id in all_users_words:
            all_users_words[user_id].update(dialogue_score)
        else:
            all_users_words[user_id] = dialogue_score

    # Get the count of 'is_collected' from UserWord for each user
    collected_words = {item['user']: {'collected_count': item['collected_count']} for item in UserWord.objects.values('user').filter(is_collected=True).annotate(collected_count=Count('is_collected'))}

    # Add the collected words count to the dict
    for user_id in all_users_words.keys():
        all_users_words[user_id].update(collected_words.get(user_id, {'collected_count': 0}))

    # Calculate average scores
    for user_id, scores in all_users_words.items():
        word_score = scores.get('word_pronunce_score', 0)
        dialogue_score = scores.get('dialogue_pronunce_score', 0)
        count = int(word_score != 0) + int(dialogue_score != 0)
        all_users_words[user_id]['avg_score'] = round((word_score + dialogue_score) / count, 2) if count else 0

    return all_users_words



def get_word_collection_rate(request):
    """
    단어 수집 비율을 반환하는 함수입니다.

    Args:
        request (HttpRequest): HTTP 요청 객체

    Returns:
        JsonResponse: 사용자별 단어 수집 비율 정보를 포함한 JSON 응답
    """
    if request.method == 'POST':
        data = json.loads(request.body) #exclude(pronunce_score__isnull=True)
        all_users_words = list(UserWord.objects.filter(is_collected=True).values('user').annotate(collect_count = Count('is_collected')).order_by('-collect_count'))
        person_count = len(all_users_words)
        
        # sum the values with same keys
        res = dict(functools.reduce(operator.add,
                                    map(collections.Counter, all_users_words)))
        collect_total_count = res["collect_count"]
        existing_words_len = len(list(Word.objects.all()))
        mean_collected_words_count = collect_total_count / person_count
        general_collection_rate = round((mean_collected_words_count / existing_words_len)*100)
        user_collect_words_count = len(list(UserWord.objects.filter(Q(is_collected=True) & Q(user__inner_id=data['user_id']))))
        user_collection_rate = round((user_collect_words_count / existing_words_len)*100)
        
        item = {"user_rate":user_collection_rate, "general_rate":general_collection_rate}
        return JsonResponse(item, status=200)

def get_pronounciation_accuracy_rate(request):
    """
    특정 사용자와 전체 사용자의 발음 정확도 점수를 가져옵니다.

    Args:
        request (HttpRequest): HTTP 요청 객체.

    Returns:
        JsonResponse: 발음 정확도 점수를 포함한 JSON 응답.
    """
    if request.method == 'POST':
        ### Specific user's
        data = json.loads(request.body)
        user_word_pronounce_obj = UserWord.objects.filter(user__inner_id=data['user_id']).exclude(pronunce_score__isnull=True).aggregate(mean_pronunce_score=Avg('pronunce_score'))
        user_word_pronounce = user_word_pronounce_obj["mean_pronunce_score"] 
        user_dialogue_pronounce_obj = UserDialogue.objects.filter(user__inner_id=data['user_id']).aggregate(mean_pronunce_score=Avg('pronunce_score'))
        user_dialogue_pronounce= user_dialogue_pronounce_obj["mean_pronunce_score"]

        user_word_pronounce = user_word_pronounce or 0
        user_dialogue_pronounce = user_dialogue_pronounce or 0
        tmp = int(user_word_pronounce != 0) + int(user_dialogue_pronounce != 0)
        user_pronounciation_accuracy_rate = round((user_word_pronounce + user_dialogue_pronounce) / tmp) if tmp else 0
        ## All user's
        ## word 
        all_users_words = return_all_scores()

        general_pronounciation_accuracy_rate = round(sum([scores['avg_score'] for scores in all_users_words.values()]) / len(all_users_words), 0) if all_users_words else 0
        return JsonResponse({'user_score':user_pronounciation_accuracy_rate, 'general_score':general_pronounciation_accuracy_rate}, status=200)

def get_rankings(request):
    """
    사용자의 랭킹과 전체 랭킹을 반환합니다.

    Args:
        request (HttpRequest): HTTP 요청 객체

    Returns:
        JsonResponse: 사용자의 랭킹과 전체 랭킹 정보를 포함한 JSON 응답
    """
    if request.method == 'POST':
        data = json.loads(request.body)

        current_user = User.objects.get(inner_id=data['user_id']) # Assuming you are using a POST method and the user_id is sent in the request
        all_scores = return_all_scores()
        
        sorted_result = sorted(all_scores.items(), key=lambda item: (item[1]['collected_count'], item[1]['avg_score']), reverse=True)
        top_ten = sorted_result[:10]  # Assuming top_ten is the first ten items of sorted_result

        ranks_list = [{"rank": rank+1, 
                    "nickname": User.objects.get(inner_id=i[0]).nickname, 
                    "collection_rate": "{:.0f}".format(i[1]['collected_count'] / len(list(Word.objects.all())) * 100), 
                    "pronunce_acc_rate": "{:.0f}".format(i[1]['avg_score'])} for rank, i in enumerate(top_ten)]

        for rank in range(1, len(sorted_result)+1):
            if sorted_result[rank-1][0] == current_user.inner_id: 
                return JsonResponse({"user_rank": rank, "population": len(sorted_result), "ranks": ranks_list}, status=200)

        return JsonResponse({"user_rank": None, "population": len(sorted_result)+1, "ranks": ranks_list}, status=200)
        # 내가 기록이 없으면 population +1해주고, ranking은 null
        # 내가 기록이 있으면 population 그대로 두고 ranking도 표기

def get_word(request):
    """
    특정 사용자와 동화의 단어 수집 정보를 반환합니다.

    Args:
        request (HttpRequest): HTTP 요청 객체

    Returns:
        HttpResponse: 단어 수집 정보를 포함한 JSON 형식의 HTTP 응답
    """
    req_data = json.loads(request.body)
    user_id = req_data['userID']
    book_id = req_data['fairytaleID']

    user_word=UserWord.objects.filter(Q(word__book__inner_id=book_id) & Q(user__inner_id=user_id))
    data={}

    for w in user_word:
        data[w.word.text]=w.is_collected

    return HttpResponse(json.dumps(data), content_type = "application/json")
