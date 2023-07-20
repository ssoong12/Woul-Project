from . import views
from django.urls import path, include
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage

def index(request):
    
    startTime = request.POST['startTime']
    voiceName = request.POST['voiceName']
    
    print(startTime, voiceName)
    
    # 전송된 파일 저장
    uploaded_file = request.FILES['file']
    fs = FileSystemStorage()
    # 저장된 파일 경로
    filepath = fs.save("test.wav", uploaded_file)
    print(uploaded_file.name)
    
    return HttpResponse('1')

urlpatterns = [
    path('word/', views.word_pronunciation_view, name='word_pronunciation_view'),
    path('dialogue/', views.dialogue_pronunciation_view, name='dialogue_pronunciation_view'),
    path('filetest/', index, name='file_test')
]