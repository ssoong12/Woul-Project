from django.shortcuts import render
from django.http import HttpResponse
from . import runmodel, repository
import json

def detect_image(request):
    """ 
        이미지와 단어를 주면 이미지 안에 해당 단어가 있는지 확인하는 Post API 함수.
            Args:
                request(HttpRequest): body에서 form-data로 word(text)와 file(file)을 받는다.
            Returns: 
                bool: 주어진 이미지 안에 단어가 있으면 true, 없으면 false
    """
    word = request.POST['word']
    userfile = request.FILES['file']

    runmodel.run(userfile)
    isdetect = runmodel.isdetected(word)

    data = {"isdetect": isdetect}
    return HttpResponse(json.dumps(data), content_type = "application/json")


def collect_word(request):
    """ 
        UserWord 테이블에서 사용자가 단어를 수집한 것(is_collected=true)으로 바꾸는 Post API 함수.
            Args:
                request(HttpRequest): body에서 json으로 ID(number)와 word(string)를 받는다.
            Returns: 
                None
    """
    req_data = json.loads(request.body)
    user_inner_id = req_data['ID']
    word = req_data['word']

    word_id = repository.findWordIdByText(word)
    repository.updateCollect(user_inner_id, word_id)

    return HttpResponse({}, content_type = "application/json")