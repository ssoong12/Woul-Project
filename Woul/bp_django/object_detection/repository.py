from django.views.decorators.csrf import csrf_exempt
from bp_django.models import User, Word, UserWord
from django.db.models import Q


@csrf_exempt
def findUserByOuterId(id: str):
    """ 
        사용자의 OuterID을 통해 user object를 가져온다.
            Args:
                id(str): 사용자의 OuterID.
            Returns: 
                User: OuterID에 해당하는 user object.
    """
    user=User.objects.get(outer_id=id)
    return user

@csrf_exempt
def findUserByInnerId(id: int):
    """ 
        사용자의 InnerId을 통해 user object를 가져온다.
            Args:
                id(int): 사용자의 InnerID.
            Returns: 
                User: InnerID에 해당하는 user object.
    """
    user=User.objects.get(inner_id=id)
    return user


@csrf_exempt
def findUserByNickname(nickname: str):
    """ 
        사용자의 닉네임을 통해 user object를 가져온다.
            Args:
                nickname(str): 사용자의 닉네임.
            Returns: 
                User: 닉네임에 해당하는 user object.
    """
    user=User.objects.get(nickname=nickname)
    return user

@csrf_exempt
def createUser(entity: User):
    """ 
        매개변수로 받은 user object를 User DB에 생성한다.
            Args:
                entity(User): 생성된 사용자 object.
            Returns: 
                None
    """
    entity.save()
    return

@csrf_exempt
def findWordIdByText(word_text: str):
    """ 
        단어의 text를 통해 word object의 id를 조회한다.
            Args:
                word_text(str): word text. ex) door, face
            Returns: 
                int: 해당하는 word의 inner ID.
    """
    word=Word.objects.get(text=word_text)
    return word.inner_id
    

@csrf_exempt
def updateCollect(user, word):
    """ 
        userword db에서 user와 word가 일치하는 레코드에 is_collected를 true로 바꾼다.
            Args:
                user(int): user의 inner ID.
                word(int): word의 inner ID.
            Returns: 
                None
    """
    user_word=UserWord.objects.filter(Q(word__inner_id=word) & Q(user__inner_id=user))
    user_word.update(is_collected=True)
