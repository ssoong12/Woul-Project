from django.apps import AppConfig


class LoginConfig(AppConfig):
    """
    로그인 앱의 설정을 정의하는 클래스입니다.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'login'
