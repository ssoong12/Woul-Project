from ultralytics import YOLO
from django.conf import settings
import os, shutil
from PIL import Image

word_map = {'0':'tree', '1':'shoes', '2':'smile', '3':'block', '4':'hand', '5':'door',
                '6':'egg', '7':'leaf', '8':'duck', '9':'water', '10':'cloud', '11':'dog', '12':'ice'}


def run(image):
    """ 
        오브젝트 디텍션 모델을 통해 이미지를 예측하고 예측 결과가 프로젝트 내에 저장된다.
            Args:
                image(MultiValueDict): form-data의 FILE에서 받아온 이미지 파일
            Returns: 
                None
    """
    delete_file()
    model_path = os.path.join(settings.BASE_DIR_D, 'object_detection\static\detect.pt')
    
    model = YOLO(model_path)

    image = Image.open(image)
    model.predict(image, conf=0.4, save_txt=True)
    

def isdetected(word):
    """ 
        저장돼 있는 예측 결과를 보고 원하는 단어가 탐지됐는지 확인한다.
            Args:
                word(string): 탐지됐는지 확인하고 싶은 단어
            Returns: 
                bool: 단어가 탐지 됐으면 true, 아니면 false
    """
    if word=='face':
        word='smile' # 모델과 db 이름 차이로 임시로 변경

    isdetect=False
    path = 'runs\detect\predict\labels.txt'
    try:
        file=open(os.path.join(settings.BASE_DIR_D, path))
    except FileNotFoundError:
        delete_file()
        return isdetect

    lines=file.readlines()

    for line in lines:
        detect_word=word_map[line.split(" ")[0]]
        if word==detect_word:
            isdetect=True
            break
    file.close()

    delete_file()
    return isdetect


def delete_file():
    """ 
        예측 결과를 저장했던 폴더를 삭제한다.
            Args:
                None
            Returns: 
                None
    """
    try:
        shutil.rmtree(os.path.join(settings.BASE_DIR_D, 'runs\detect\\'))
    except FileNotFoundError:
        print('존재하지 않는 파일입니다.')