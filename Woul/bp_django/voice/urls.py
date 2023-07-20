from django.urls import path
from . import views

urlpatterns = [
    path("test/", views.AudioUploadView.as_view()),
    path("return/", views.return_vocal_names),
    path("model/", views.request_voice_synthesis),
    path("status/", views.get_synthesis_status),
]
