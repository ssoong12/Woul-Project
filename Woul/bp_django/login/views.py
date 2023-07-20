from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.

def check_if_user_exist(request):
    """
    사용자의 존재 여부를 확인하는 뷰 함수입니다.

    Args:
        request (HttpRequest): HTTP 요청 객체

    Returns:
        HttpResponse: HTTP 응답 (상태코드 200)
    """
    return HttpResponse(status=200)