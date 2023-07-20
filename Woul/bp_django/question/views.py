from django.http import HttpResponse, JsonResponse
from bp_django.models import User,Question, Answer
import random
import json
from datetime import datetime
from dateutil import tz
import pytz
from django.forms.models import model_to_dict
from collections import defaultdict
from django.core.exceptions import ObjectDoesNotExist

def utc_to_local_time(dt_str):
    '''
    Convert UTC time to local time
    Args:
        dt_str: UTC time string
    Returns:
        local_time_str: local time string
    '''
    # dt_str  = "10/21/2021 8:18:19"
    format  = "%Y-%m-%d %H:%M:%S.%f%z"
    format2 = "%Y-%m-%d"
    #"%m/%d/%Y %H:%M:%S"
    # Create datetime object in local timezone
    dt_utc = datetime.strptime(dt_str, format)
    dt_utc = dt_utc.replace(tzinfo=pytz.UTC)
    # Get local timezone
    local_zone = tz.tzlocal()
    # Convert timezone of datetime from UTC to local
    dt_local = dt_utc.astimezone(local_zone)
    local_time_str = dt_local.strftime(format2)
    return local_time_str
    

# Create your views here
def get_post_list(request):
    '''
    Returns a list of all posts.
    Args:
        request: the request object
            None
        
    Returns:
        A JsonResponse containing a list of all posts
        {'inner_id': 1,
        'created_at': '2021-10-21',
        'nickname': '별명',
        'user_id': 1,
        'title': '질문이 있습니다',
        'answers': False}
    '''
    
    question_list = Question.objects.all()
    # print(list(question_list)[0].inner_id)
    # print(list(question_list)[0].user.)
    result = list()
    for question in question_list:
        temp = defaultdict()
        temp["inner_id"] = question.inner_id
        temp["created_at"]= utc_to_local_time(str(question.created_at))
        temp["nickname"] = question.user.nickname
        temp["user_id"] = question.user_id
        temp["title"] = question.title
        try:
            new = question.answers
            temp["answers"] = True
        except ObjectDoesNotExist:
            temp["answers"] = False              

        result.append(temp)
    return JsonResponse(result, safe = False)


def get_post(request, post_id):
    '''
    Returns a post with the given id
    Args:
        request: the request object
            None
        post_id: the id of the post to return

    Returns:
        A JsonResponse containing the post with the given id
        {'user_outer_id': 1,
        'user_nickname': '닉네임',
        'title': '질문이 있습니다',
        'content': '이건 어떻게 하나요?',
        'created_at': '2021-10-21',
        'answer': {
            'inner_id': 1,
            'content': '답변입니다',
            'created_at': '2021-10-21',
            'user_id': 1,
            'question_id': 1
            }
        }
    '''
    post = Question.objects.get(inner_id = post_id)
    #2023-06-27T14:53:54.554Z todo korean time으로 바꾸기
    try:
        answer = Answer.objects.get(question_id = post_id)
    except:
        # answer가 존재하지 않으면 null을 넣어서 내보냄
        return JsonResponse({'user_outer_id': post.user.outer_id, 'user_nickname': post.user.nickname, "title": post.title, "content": post.content, "created_at": utc_to_local_time(str(post.created_at)), "answer": None})
    # answer가 존재하면 answer object를 넣어서 보냄

    answer = model_to_dict(answer)
    return JsonResponse({'user_outer_id': post.user.outer_id, 'user_nickname': post.user.nickname, "title": post.title, "content": post.content, "created_at": utc_to_local_time(str(post.created_at)), "answer": answer})

def create_post(request):
    '''
    Creates a new post, and store data in database
    Args:
        request: the request object
            user_id: the id of the user who creates the post
            title: the title of the post
            content: the content of the post

    Returns:
        A HttpResponse with status code 201 if the post was created successfully, 401 otherwise
    '''
    data = json.loads(request.body)
    
    Question(inner_id = random.randint(0, 999999999), title = data['title'], content = data['content'],  user_id = data['user_id']).save()
    return HttpResponse(status=201)


def create_answer(request, post_id):
    '''
    Creates a new answer, only admin can create answer
    Args:
        request: the request object
            user_id: the id of the user who creates the post
            content: the content of the post
        post_id: the id of the post to answer

    Returns:
        A HttpResponse with status code 201 if user is admin, 401 otherwise
    '''
    
    # adm=User.objects.get(inner_id = 907447047)
    # adm.is_admin = True
    # adm.save()

    data = json.loads(request.body)
    current_user = User.objects.get(inner_id = data['user_id'])
    if current_user.is_admin == False:
        return HttpResponse(status = 401) # Unauthorized
    else:
        Answer(inner_id = random.randint(0, 999999999), content = data["content"], question_id = post_id, user_id = data["user_id"]).save()
        return HttpResponse(status=201)
