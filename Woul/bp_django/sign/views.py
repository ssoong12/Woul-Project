from django.http import HttpResponse, JsonResponse
from bp_django.models import User, Word, UserWord, Dialogue, UserDialogue
import random
from django.contrib.auth.hashers import make_password, check_password
import json
from object_detection.repository import findUserByOuterId, findUserByNickname, createUser
# Create your views here.

def check_if_id_exist(request):
    """
    사용자 ID의 존재 여부를 확인하는 뷰 함수입니다.

    Args:
        request (HttpRequest): HTTP 요청 객체

    Returns:
        JsonResponse: ID의 존재 여부를 포함한 JSON 응답
    """
    if request.method == 'POST':
        try:
            new_user = findUserByOuterId(request.GET.get('id', None))
            return JsonResponse({'is_exist':True}) # 존재하면 True
        except:
            return JsonResponse({'is_exist':False}) # 존재하지 않으면 False
    
    
def check_if_nickname_exist(request):
    """
    사용자 닉네임의 존재 여부를 확인하는 뷰 함수입니다.

    Args:
        request (HttpRequest): HTTP 요청 객체

    Returns:
        JsonResponse: 닉네임의 존재 여부를 포함한 JSON 응답
    """
    if request.method == 'POST':
        try:
            new_user = findUserByNickname(request.GET.get('nickname', None))
            return JsonResponse({'is_exist':True}) # 존재하면 True
        except:
            return JsonResponse({'is_exist':False}) # 존재하지 않으면 False


def create_account(request):
    """
    계정을 생성하는 뷰 함수입니다.

    Args:
        request (HttpRequest): HTTP 요청 객체

    Returns:
        HttpResponse: HTTP 응답 (상태코드 201)
    """
    if request.method == 'POST':    
        request_data = json.loads(request.body)
        outer_id =  request_data['id']
        nickname =  request_data['nickname']
        password =  request_data['password']
        is_admin =  request_data['is_admin']

        encryptedpassword = make_password(password, None)

        user = User(inner_id = random.randint(0, 999999999), outer_id = outer_id, nickname = nickname, password = encryptedpassword, is_admin = is_admin)
        createUser(user)
        
        ## userword
        userword_list = list()
        for word in Word.objects.all():
            pronunce_score = None
            is_collected = False
            userword = UserWord(inner_id = random.randint(0, 999999999), pronunce_score = pronunce_score, is_collected = is_collected, word = word, user = user)
            userword_list.append(userword)
            
        UserWord.objects.bulk_create(userword_list)
        
        ## userdialogue
        # userdialogue_list = list()
        # for dialogue in Dialogue.objects.all():
        #     pronunce_score = None
        #     path_to_sound = ""
        #     is_recorded = False
        #     userdialogue = UserDialogue(inner_id= random.randint(0, 999999999), pronunce_score = pronunce_score, path_to_sound = path_to_sound, user = user, dialogue = dialogue)
        #     userdialogue_list.append(userdialogue)
            
        # UserDialogue.objects.bulk_create(userdialogue_list)
            
        return HttpResponse(status=201)

def check_account(request):
    """
    계정 정보의 유효성을 확인하는 뷰 함수입니다.

    Args:
        request (HttpRequest): HTTP 요청 객체

    Returns:
        HttpResponse 또는 JsonResponse: 계정 정보의 유효성 여부에 따른 HTTP 응답
    """
    if request.method == 'POST':

        data = json.loads(request.body)
        try:
            user = findUserByOuterId(data['id'])
        except:
            return HttpResponse(status=400)
        
        encryptedpassword = user.password
        checkpassword=check_password(data['password'], encryptedpassword)
        if checkpassword:
            return JsonResponse({"inner_id": user.inner_id, "nickname": user.nickname}, status = 200)
        else:
            return HttpResponse(status = 400)
        
