"""
URL configuration for bp_django project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
import object_detection.urls
from pronunce.views import word_pronunciation_view
from django.conf import settings
import os
from django.views.generic import TemplateView

def gettest(req):
    return HttpResponse('hello')

# def index(request):
#     try:
#         index_path = os.path.join(settings.BASE_DIR, 'build', 'index.html')
#         with open(index_path, 'r') as file:
#             return HttpResponse(file.read())
#     except FileNotFoundError:
#         return HttpResponse("리액트 앱이 빌드되지 않았습니다.", status=501)

urlpatterns = [
    path("admin/", admin.site.urls),
    # 모든 주소를 우선 client 쪽으로 연결 시킴
    path('', TemplateView.as_view(template_name='index.html'),name='index'),
    path('gettest/', gettest),
    path("sign/", include("sign.urls")),
    path("login/", include("login.urls")),
    path("dashboard/", include("dashboard.urls")),
    path("question/", include("question.urls")),
    path('detection/', include('object_detection.urls')),
    path('pronunce/', include('pronunce.urls')),
    path('voice/', include('voice.urls')),
]
