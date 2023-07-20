from django.urls import path
from . import views

urlpatterns = [
    path("is-detect/", views.detect_image),
    path("collect-word", views.collect_word)
]
