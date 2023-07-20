from django.urls import path
from . import views

urlpatterns = [
    path("check-user/", views.check_if_user_exist),
]
