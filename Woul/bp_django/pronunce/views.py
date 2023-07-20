from django.db.models import Q
from django.http import JsonResponse
import azure.cognitiveservices.speech as speechsdk
from bp_django.models import UserWord, Word, Dialogue, UserDialogue
import os, random
import tempfile
import json
import environ
env = environ.Env()

# environ.Env.read_env(env_file=os.path.join('C:/Users/User/Desktop/경현/프로젝트/빅프로젝트/project/project/AI_8_30/bp_django/bp_django', '.env'))
# environ.Env.read_env(env_file=os.path.join('C:/Users/User/빅프/AI_8_30/bp_django/bp_django', '.env'))
environ.Env.read_env(env_file=os.path.join('bp_django/.env'))

def measure_pronunciation_accuracy(audio_file, referenceText):
    """
    Azure Speech 음성 인식 API를 사용하여 발음 정확도를 측정합니다.

    Args:
        audio_file (file): 오디오 파일
        referenceText (str): 참조 텍스트

    Returns:
        dict: 발음 정확도 측정 결과
    """
    pronunciation_assessment_config = speechsdk.PronunciationAssessmentConfig(
        json_string=f'{{"referenceText":"{referenceText}","gradingSystem":"HundredMark","granularity":"Phoneme","phonemeAlphabet":"SAPI","nBestPhonemeCount":3}}'
    )

    speech_config = speechsdk.SpeechConfig(subscription=env("AZURE_SUBSCRIPTION_KEY"), region=env("AZURE_REGION"))
    speech_config.speech_recognition_language = "en-US"

    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(audio_file.read())
        temp_file_path = temp_file.name

    audio_config = speechsdk.audio.AudioConfig(filename=temp_file_path)
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

    pronunciation_assessment_config.apply_to(speech_recognizer)
    speech_recognition_result = speech_recognizer.recognize_once()

    pronunciation_assessment_result = speechsdk.PronunciationAssessmentResult(speech_recognition_result)
    pronunciation_assessment_result_json = speech_recognition_result.properties.get(
        speechsdk.PropertyId.SpeechServiceResponse_JsonResult
    )

    data = json.loads(pronunciation_assessment_result_json)
    
    return data

def word_pronunciation_view(request):
    """
    단어 수집 #2 발음정확도 측정 결과를 반환 및 DB에 Update합니다.

    Args:
        request (HttpRequest): HTTP 요청 객체

    Returns:
        JsonResponse: 발음 정확도 측정 결과를 포함하는 JSON 응답
    """
    if request.method == 'POST':
        word = request.POST['word']
        user_id = request.POST['ID']
        audio_file = request.FILES.get('file')

        # 발음 정확도 측정 함수 호출
        pronunciation_result = measure_pronunciation_accuracy(audio_file, word)
        pron_score = pronunciation_result['NBest'][0]['PronunciationAssessment']['PronScore']

        # UserWord 테이블에서 user와 word가 매핑된 적절한 행을 찾고 pronunce_score 필드를 업데이트
        try:
            word_obj = Word.objects.get(text=word)
            word_id = word_obj.inner_id

            userword_instance = UserWord.objects.get(word_id=word_id, user__inner_id=user_id)
            userword_instance.pronunce_score = pron_score
            userword_instance.save()

            response_data = {'pronScore': pron_score}
            return JsonResponse(response_data)
        except UserWord.DoesNotExist:
            response_data = {'message': '해당하는 UserWord를 찾을 수 없습니다.'}
            return JsonResponse(response_data, status=404)
    else:
        response_data = {'message': '잘못된 요청 메서드입니다.'}
        return JsonResponse(response_data, status=400)

# 대사 따라하기 발음정확도 측정 결과 반환
def dialogue_pronunciation_view(request):
    """
    대사 따라하기 발음정확도 측정 결과를 반환 및 DB에 Update합니다.

    Args:
        request (HttpRequest): HTTP 요청 객체

    Returns:
        JsonResponse: 발음 정확도 측정 결과를 포함하는 JSON 응답
    """
    if request.method == 'POST':
        sentence = request.POST['sentence']
        user_id = request.POST['ID']
        audio_file = request.FILES.get('file')

        # 발음 정확도 측정 함수 호출
        pronunciation_result = measure_pronunciation_accuracy(audio_file, sentence)
        pron_score = pronunciation_result['NBest'][0]['PronunciationAssessment']['PronScore']

        # 1) UserDialouge 테이블에서 user와 dialouge가 매핑된 적절한 행을 찾고 pronunce_score 필드를 업데이트
        # 2) UserDialog를 새로 추가되는 것으로 변경
        try:
            dialogue_obj = Dialogue.objects.get(text=sentence)
            dialogue_id = dialogue_obj.inner_id

            obj, created = UserDialogue.objects.get_or_create(
                dialogue_id=dialogue_id,
                user_id=user_id,
                defaults={
                    'inner_id': random.randint(0, 999999999),
                    'pronunce_score': pron_score
                }
            )
            if (not created):
                obj.pronunce_score = pron_score
                obj.save()
                

            response_data = {'pronScore': pron_score}
            return JsonResponse(response_data)

                
        except UserWord.DoesNotExist:
            response_data = {'message': '해당하는 UserWord를 찾을 수 없습니다.'}
            return JsonResponse(response_data, status=404)
    else:
        response_data = {'message': '잘못된 요청 메서드입니다.'}
        return JsonResponse(response_data, status=400)