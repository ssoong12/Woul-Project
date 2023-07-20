from django.shortcuts import render
from django.core.files.base import ContentFile
from django.views import View
from django.http import JsonResponse
from django.utils.dateparse import parse_datetime
from bp_django.models import Voice, User
import random
from datetime import datetime
import pytz
import os
from bp_django.celery import app
from django.conf import settings

voice_path = os.path.join(settings.BASE_DIR_D, 'voice', 'RVC', 'voice_files')


# output: {"message": "Success", "user_id": "778457631", "inner_id": 310946693, "request_time": "20230626152907"}
# input: POST form-data {"file": <File>, "ID": "778457631", "vocalName": "test"}

class AudioUploadView(View):
    def post(self, request, *args, **kwargs):
        '''
        오디오 파일을 업로드합니다.
        Args:
            param request: 
                POST form-data {"file": <File>, "ID": user_inner_id(int), "vocalName": vocal_name(str)}
        returns:
            {"message": "Success", "user_id": user_inner_id, "inner_id": voice_inner_id, "request_time": "YYYYmmddHHMMSS"}
        '''
        if 'file' in request.FILES:
            file = request.FILES['file']

            # 추가적인 데이터를 가져옵니다.
            user_id = request.POST.get('ID')
            vocal_name = request.POST.get('vocalName')
            print(user_id, vocal_name)
            # 데이터베이스에서 같은 inner_id와 vocal_name을 가진 음성 파일이 있는지 확인합니다.
            existing_voice = Voice.objects.filter(user__inner_id=user_id, vocal_name=vocal_name).first()

            if existing_voice:
                return JsonResponse({'error': 'Voice with this name already exists for the user'}, status=400)
            
            # KST 시간대를 사용하여 현재 시간을 가져옵니다.
            kst = pytz.timezone('Asia/Seoul')
            request_time = datetime.now(kst)
            # 현재 시간에 대한 타임스탬프를 가져옵니다.
            timestamp = datetime.timestamp(request_time)
            # 일부 자리를 가져와 정수로 변환합니다.
            timestamp_part = str(int(timestamp))
            # 이 값을 사용합니다. 나중에 개선 필요
            print(f'user_id: {user_id}, timestamp_part: {timestamp_part}')

            inner_id = int(str(user_id)[-2:] + timestamp_part[-4:-1] + "{:04}".format(random.randint(0, 9999)))
            user = User.objects.get(inner_id=user_id)
            os.path.join(voice_path, str(inner_id))

            # origin_file = convert_to_wav(file, inner_id, True)
            origin_file = os.path.join(voice_path, str(inner_id))

            # Voice 모델에 데이터 저장
            voice = Voice(
                inner_id=inner_id,
                vocal_name=vocal_name,
                path_to_voice_file=origin_file,
                synthesis_status='initial',
                created_at=request_time,
                task_id=None,
                user=user,
            )
            voice.save()
            
            # 응답을 반환합니다.
            response_data = {
                'message': 'Success',
                'userID': user_id,
                'voiceID': inner_id,
                'requestTime': request_time.strftime('%Y%m%d%H%M%S'),
            }
            return JsonResponse(response_data, status=200)
        else:
            return JsonResponse({'error': 'No File Attached'}, status=400)

from pydub import AudioSegment
from pydub.silence import split_on_silence, detect_nonsilent

# 음성파일을 wav로 변환
# file: 파일 경로
# voice_id: 음성 파일의 inner_id
# origin: True면 원본 파일을 변환, False면 원본 파일을 변환하지 않고 12분 단위로 나눈 파일을 변환
# target_length_in_sec: 변환할 파일의 길이
# path: 음성 파일이 저장될 경로
def convert_to_wav(file, voice_id, origin=True, target_length_in_sec=720, path=voice_path):
    '''
    음성 파일을 wav로 변환합니다.
    Args:
        param file: 파일 경로
        param voice_id: 음성 파일의 inner_id
        param origin: True면 원본 파일을 변환, False면 원본 파일을 변환하지 않고 12분 단위로 나눈 파일을 변환
        param target_length_in_sec: 변환할 파일의 길이
        param path: 음성 파일이 저장될 경로
    returns:
        origin이 True면 원본 파일의 경로, False면 변환된 파일이 저장된 폴더 경로
    '''
    try:
        print(f"audio processing start.. {voice_id}")
        if not os.path.exists(path):
            os.makedirs(path)
            os.makedirs(os.path.join(path, "origin"))
        os.makedirs(os.path.join(path, str(voice_id)), exist_ok=True)
        os.makedirs(os.path.join(path, "origin", str(voice_id)), exist_ok=True)
        # 원본파일 전처리 후 저장
        if origin:
            print("Mode: Origin")
            audio = AudioSegment.from_file(file)
            audio = audio.set_channels(1)  # convert to mono
            audio = audio.set_frame_rate(44100)  # convert to 44.1kHz
            os.makedirs(os.path.join(path, "origin", str(voice_id)), exist_ok=True)
            origin_file_name = os.path.join(path, "origin", str(voice_id), f"{voice_id}_origin.wav")
            audio.export(origin_file_name, format='wav')
            print("Done.")
            return origin_file_name
        # 침묵을 제외하고 1분 단위로 최대 12분까지 잘라서 저장
        else:
            audio = AudioSegment.from_file(file)
            print(f"Mode: Process, file: {file}")
            counter = 0
            length = 0
            target_length_ms = target_length_in_sec * 1000  # convert target length to ms
            trimmed_audio = AudioSegment.empty()
            silent_padding = AudioSegment.silent(duration=1000)
            nonsilent_ranges = detect_nonsilent(audio, min_silence_len=2000, silence_thresh=-32)  # customize as needed
            break_outer_loop = False
            print(nonsilent_ranges)
            for start, end in nonsilent_ranges:
                segment = audio[start:end]
                while len(segment) > 0:
                    slice_length = min(target_length_ms - len(trimmed_audio), len(segment))
                    trimmed_audio += segment[:slice_length]
                    segment = segment[slice_length:]
                    
                    if len(trimmed_audio) >= 60000:  # If trimmed audio reaches 1 miniute
                        new_file_name = os.path.join(path, str(voice_id), f"{voice_id}_{counter}.wav")
                        trimmed_audio.export(new_file_name, format='wav')
                        trimmed_audio = AudioSegment.empty()
                        counter += 1
                    else:
                        trimmed_audio += silent_padding  # add silent padding between fragments
                    
                    length += slice_length
                    if length >= target_length_ms:
                        break_outer_loop = True  # Set the flag to break the outer loop
                        break

                if break_outer_loop:  # Break the outer loop if the flag is set
                    break

            if len(trimmed_audio) > 0:  # If there's still some audio left over
                new_file_name = os.path.join(path, str(voice_id), f"{voice_id}_{counter}.wav")
                trimmed_audio.export(new_file_name, format='wav')
            print("Done.")
            print(f"Files Num: {counter + 1}, Total Files length: {length // 1000}")
            return os.path.dirname(new_file_name)
    
    except Exception as e:
        print(f"An error occurred while converting the file: {e}")
        return None


# output: {'vocalName': ['default', 'vocal1', 'vocal2', ...], 'voiceID': [0, 1, 2, ...]}
# input: {'ID': 'user_id'}
def return_vocal_names(request):
    '''
    user_id에 해당하는 음성 파일의 vocal_name과 inner_id를 반환합니다.
    Args:
        param request: {'ID': 'user_id'}
    returns:
        {'vocalName': ['default', 'vocal1', 'vocal2', ...], 'voiceID': [0, 1, 2, ...]}
    '''
    user_id = request.GET.get('ID')

    if not user_id:
        return JsonResponse({'error': 'ID is required'}, status=400)

    voices = Voice.objects.filter(
        user__inner_id=user_id,
        synthesis_status='finish'
        ).order_by('created_at') # filter() 사용
    
    # if not voices.exists(): # 일치하는 Voice 객체가 없는 경우
    #     return JsonResponse({'error': f'No voice data for user_id: {user_id}'}, status=404)

    vocal_names = [voice.vocal_name for voice in voices] # list comprehension을 사용하여 vocal_name 리스트 생성
    voice_ids = [voice.inner_id for voice in voices] # list comprehension을 사용하여 inner_id 리스트 생성

    # default 값을 추가합니다.
    vocal_names.insert(0, 'default')
    voice_ids.insert(0, 0)

    return JsonResponse({'vocalName': vocal_names, 'voiceID': voice_ids}, status=200)

import subprocess
import shutil
import time

@app.task
def run_scripts(voice_inner_id, path_to_voice_file, path_to_dataset, infer_dataset=0, epoch=100):

    '''
    RVC 모델을 학습합니다.
    Args:
        param voice_inner_id: Voice db의 고유 inner id, 합성된 목소리는 동화경로/동화/voice/{voice_inner_id} 에 저장됩니다.
        param path_to_voice_file: original voice file path, bp_django/voice/RVC/rvc/origin/{voice_inner_id}/{voice_inner_id}_origin.wav
        param path_to_dataset: 동화 경로, bp_react/public/book/
        param infer_dataset: 기본 동화 목소리가 들어있는 경로. bp_react/public/book/동화/voice/{infer_dataset}을 사용하며, 추론에 사용될 원본 목소리를 {infer_dataset} 폴더에 저장해두어야 합니다.
        param epoch: 학습할 epoch 수. 추천 epoch 수는 100이며, Colab T4, 학습 데이터 10분 기준으로 1 epoch 당 약 34초가 소요됩니다.
    returns:
        None
    '''
    # os.environ['FORKED_BY_MULTIPROCESSING'] = '1'
    # preprocessed_file = convert_to_wav(path_to_voice_file, voice_inner_id, False)
    # path_to_voice_file = preprocessed_file
    # path = os.path.join(settings.BASE_DIR_D, "voice", "RVC", "rvc")
    # voice_path = os.path.relpath(path_to_voice_file, path)
    # print(voice_path)
    # dataset_path = os.path.relpath(path_to_dataset, path)
    # os.makedirs(f"{path}/logs/{voice_inner_id}", exist_ok=True)
    # subprocess.run(["python", "trainset_preprocess_pipeline_print.py", voice_path, "40000", "16", f"./logs/{voice_inner_id}", "False"], cwd=path)
    # subprocess.run(["python", "extract_f0_print.py", f"./logs/{voice_inner_id}", "16", "harvest"], cwd=path)
    # subprocess.run(["python", "extract_feature_print.py", "cuda:0", "1", "0", "0", f"./logs/{voice_inner_id}", "v2"], cwd=path)
    # subprocess.run(["python", "write_filelist.py", str(voice_inner_id)], cwd=path)
    # os.environ['PYTORCH_CUDA_ALLOC_CONF'] = 'max_split_size_mb:32'
    # subprocess.run(["python", "train_nsf_sim_cache_sid_load_pretrain.py", "-e", str(voice_inner_id), "-sr", "40k", "-f0", "1", "-bs", "1", "-g", "0", "-te", str(epoch), "-se", str(epoch), "-pg", "f0G40k.pth", "-pd", "f0D40k.pth", "-l", "0", "-c", "0", "-sw", "0", "-v", "v2"], cwd=path)
    # subprocess.run(["python", "inference.py", str(voice_inner_id), str(infer_dataset), dataset_path], cwd=path)
    # shutil.rmtree(f"{path}/logs/{voice_inner_id}", ignore_errors=True)

    # Update the voice db's synthesis_status to finish.
    # Assuming 'Voice' is the name of your model and 'voice_inner_id' is the unique identifier.
    time.sleep(60)
    voice = Voice.objects.get(inner_id=voice_inner_id)
    voice.synthesis_status = 'finish'
    voice.save()


def request_voice_synthesis(request):
    '''
    해당 목소리의 합성을 요청합니다.
    Args:
        param request: GET 요청
    returns:
        {'status': 'Success', 'voiceID': 151234567, 'task_id': UUID('12345678-1234-1234-1234-123456789012')}
    '''
    user_id = request.GET.get('ID')
    voice_name = request.GET.get('vocalName')
    epoch = request.GET.get('epoch')
    if epoch is None:
        epoch = 100
        
    voice_inner_id = Voice.objects.get(user__inner_id=user_id, vocal_name=voice_name).inner_id
    # 전처리 시작을 알리는 status를 processing으로 변경합니다.
    voice = Voice.objects.get(inner_id=voice_inner_id)
    voice.synthesis_status = 'processing'
    # voice.task_id = task.id
    voice.save()
    
    path_to_voice_file = Voice.objects.get(inner_id=voice_inner_id).path_to_voice_file
    # path_to_voice_file = convert_to_wav(path_to_voice_file, voice_inner_id, False)
    path_to_dataset = os.path.join(settings.BASE_DIR_D.parent, 'bp_react', 'public', 'book')
    
    task = run_scripts.delay(voice_inner_id, path_to_voice_file, path_to_dataset, 0, epoch)
    
    voice = Voice.objects.get(inner_id=voice_inner_id)
    # voice.synthesis_status = 'processing'
    voice.task_id = task.id
    voice.save()
    return JsonResponse({'status': 'Success', 'voiceID': voice_inner_id, 'taskID': task.id}, status=200)

from celery.result import AsyncResult

# output: {'isSynthesis': 1/0, 'statTime': 'YYYYmmddHHMMSS'}
# input: {'ID': 'user_id'}
def get_synthesis_status(request):
    '''
    해당 유저의 목소리 합성 상태를 반환합니다.
    Args:
        param request: GET 요청
    returns:
        {'isSynthesis': 1/0, 'statTime': 'YYYYmmddHHMMSS'}
    '''
    try:
        user_id = request.GET.get('ID')
        # vocal_name = request.GET.get('vocalName')
        # task_id = Voice.objects.get(user__inner_id=user_id, vocal_name=vocal_name).task_id
        # status = Voice.objects.get(user__inner_id=user_id, vocal_name=vocal_name).synthesis_status
        # task = AsyncResult(task_id)
        if Voice.objects.filter(user__inner_id=user_id, synthesis_status='processing').exists():
            utc_time = Voice.objects.get(user__inner_id=user_id, synthesis_status='processing').created_at
            kst_tz = pytz.timezone('Asia/Seoul')  # Get KST timezone
            kst_time = utc_time.astimezone(kst_tz)  # Convert to KST
            isSynthesis = 1
            data = {
                'isSynthesis': isSynthesis,
                'startTime': kst_time.strftime('%Y%m%d%H%M%S'),
            }

        else:
            isSynthesis = 0
            data = {
                'isSynthesis': isSynthesis,
                'startTime': '99999999999999',
            }

        return JsonResponse(data)
    
    except Exception as e:
        print(e)
        return JsonResponse({'status': 'Fail'}, status=400)