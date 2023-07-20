from django.urls import path
from . import views

urlpatterns = [
    path("check-id/", views.check_if_id_exist),
    path("check-nickname/", views.check_if_nickname_exist),
    path("create-account/", views.create_account),
    path("check-account/", views.check_account),
]
