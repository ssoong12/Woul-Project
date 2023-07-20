from django.urls import path
from . import views

urlpatterns = [
    path("get-post-list/", views.get_post_list),
    path("get-post/<int:post_id>/", views.get_post),
    path("create-post/", views.create_post),
    path("create-answer/<int:post_id>/", views.create_answer),
]
