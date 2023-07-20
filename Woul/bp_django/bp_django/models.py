from django.db import models
from django.core.exceptions import ValidationError

class User(models.Model):
    inner_id = models.BigIntegerField(primary_key = True)
    outer_id = models.CharField(max_length = 50)
    nickname = models.CharField(max_length = 20)
    password = models.CharField(max_length = 200)
    is_admin = models.BooleanField(default = False)

class Book(models.Model):    
    inner_id = models.BigIntegerField(primary_key = True) 
    name = models.CharField(max_length = 50)


class Word(models.Model):
    inner_id = models.BigIntegerField(primary_key = True)
    text = models.CharField(max_length = 50)
    meaning = models.CharField(max_length = 50)
    
    book = models.ForeignKey(Book, on_delete = models.CASCADE, related_name = 'words')


class UserWord(models.Model):
    inner_id = models.BigIntegerField(primary_key=True)
    pronunce_score = models.DecimalField(max_digits=5, decimal_places=2, default=None, null=True)
    is_collected = models.BooleanField(default=False)

    word = models.ForeignKey(Word, on_delete=models.CASCADE, related_name="user_words")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_words")

    def __str__(self):
        return f"{self.user.nickname}'s {self.word.text}"

def validate_syn_status(value):
    """
    합성 상태를 유효성 검사하는 함수입니다.

    Args:
        value (str): 합성 상태 값

    Raises:
        ValidationError: 유효하지 않은 상태일 경우 예외가 발생합니다.
    """
    if not ['initial','processing','finish'] in value:
       raise ValidationError("Not a valid state, 'initial','processing','finish' are valid.")
    else:
       return value

class Voice(models.Model):
    inner_id = models.BigIntegerField(primary_key = True, null = False)
    vocal_name = models.CharField(max_length = 50, null = False)
    path_to_voice_file = models.CharField(max_length = 200, null = False)
    synthesis_status = models.CharField(max_length = 50, null = False, validators = [validate_syn_status])
    created_at = models.DateTimeField(auto_now = True, null = False)
    task_id = models.CharField(max_length = 50, null = True)

    user = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'voices')


class VoiceBook(models.Model):
    inner_id = models.BigIntegerField(primary_key = True)
    path_to_synthesized_voice = models.CharField(max_length = 200)

    voice = models.ForeignKey(Voice, on_delete = models.CASCADE, related_name = 'voicebooks')
    book = models.ForeignKey(Book, on_delete = models.CASCADE, related_name = 'voicebooks')
    
    
class Page(models.Model):    
    inner_id = models.BigIntegerField(primary_key = True)
    path_to_reading_voice = models.CharField(max_length = 200)

    book = models.ForeignKey(Book, on_delete = models.CASCADE, related_name = 'pages')

class Question(models.Model):
    inner_id = models.BigIntegerField(primary_key = True)
    title = models.CharField(max_length = 50)
    content = models.CharField(max_length = 500)
    created_at = models.DateTimeField(auto_now = True, null = False)
 
    user = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'questions')
 
 
class Answer(models.Model):
    inner_id = models.BigIntegerField(primary_key = True)
    content = models.CharField(max_length = 500)
    created_at = models.DateTimeField(auto_now = True, null = False)
 
    user = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'answers')
    question = models.OneToOneField(Question, on_delete = models.CASCADE, related_name = 'answers')


class Dialogue(models.Model):
    inner_id = models.BigIntegerField(primary_key = True)
    text = models.CharField(max_length = 200, null = False)
    meaning = models.CharField(max_length = 200, null = False)
    
    book = models.ForeignKey(Book, on_delete = models.CASCADE, related_name = 'dialogues')

 
class UserDialogue(models.Model):
    inner_id = models.BigIntegerField(primary_key = True, null = False)
    pronunce_score = models.DecimalField(max_digits = 5, decimal_places = 2, null = False)
    path_to_sound = models.CharField(max_length = 200, null = False)
    
    user = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'userdialogues')
    dialogue = models.ForeignKey(Dialogue, on_delete = models.CASCADE, related_name = 'userdialogues')

