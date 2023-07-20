from django.urls import path
from . import views

urlpatterns = [
    path("get-word-collection-rate/", views.get_word_collection_rate),
    path("get-pronounciation-accuracy-rate/", views.get_pronounciation_accuracy_rate),
    path("get-rankings/", views.get_rankings),
    path("get-word/", views.get_word),
]
