from django.apps import AppConfig


class SignConfig(AppConfig):
    """
    회원가입(Sign) 앱의 설정을 정의하는 클래스입니다.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'sign'
