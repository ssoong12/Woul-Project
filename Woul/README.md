# 객체 탐지와 음성 인식 기술을 활용한 아동용 수집형 영단어 학습 웹 어플리케이션입니다.

## 프로젝트 소개

### 포스터
![빅프_포스터](https://github.com/AIVLE-School-Third-Big-Project/AI_8_30/assets/80496813/b9827607-76e9-4242-91d9-5c8d1f20a7e3)

### 시연 영상
[https://www.youtube.com/watch?v=pW6qYLYHJEQ](https://youtu.be/XkgCUSjI270)

### 발표 자료
https://drive.google.com/file/d/1wQm04EfdTiJAy4uXpkTPQCplLpwKnv_D/view?usp=sharing


## 필요 환경

### 패키지 설치
  - front : bp_react 폴더에서 npm install
  - back : bp_django 폴더에서 pip install -r requirements.txt

### Python == 3.10

### PostgreSQL:
https://www.postgresql.org/download/

### rabbitMQ:
Window PowerShell 관리자 모드에서
choco install rabbitmq

- Window일 경우:
  - ffmpeg 설치 및 환경변수 설정
  - https://ffmpeg.org/download.html#build-windows
  - Window SDK 설치
  - C++ Visual 14.0 이상 설치 https://visualstudio.microsoft.com/ko/vs/older-downloads/

### Node.js 설치

### 목소리 합성 요구 사항:
GPU GTX 1660 6GB 이상

### 모델 가중치 설정
  - 객체 탐지 https://drive.google.com/file/d/116fSLQamjuX_QM-Eu9ddToPq_seBWY1s/view?usp=sharing
    - AI_8_30\bp_django\object_detection\static\detect.pt 세팅
  - 목소리 합성 https://huggingface.co/lj1995/VoiceConversionWebUI/tree/main
    - AI_8_30\bp_django\voice\RVC\rvc에 위 링크의 hubert_base.pt, pretrained_v2/f0D40k.pth, f0G40k.pth를 다운받아 넣기

### .env 파일 설정
![Snipaste_2023-07-06_15-36-46](https://github.com/AIVLE-School-Third-Big-Project/AI_8_30/assets/80496813/4e95b538-1a65-48ec-aa58-ed26c4ba5d46)

  - .env 파일은 프로젝트에서 사용되는 환경 변수를 설정하는 파일
  - 이 파일을 사용하여 프로젝트의 설정과 중요한 정보를 보관
    
  1. AI_8_30/bp_django/bp_django/.env
  2. 파일 이름을 .env로 지정 (파일 이름 앞에 점(.)을 붙여 숨김 파일로 만듦)
  3. 파일을 텍스트 에디터로 열고 다음과 같은 형식으로 환경 변수를 설정
    KEY_NAME=VALUE
ex) AZURE_KEY=YOUR_AZURE_KEY

### Azure 키 발급
  1. Azure Portal에 로그인
  2. 적절한 구독을 선택한 후, 리소스 그룹으로 이동
  3. 리소스 그룹에서 Cognitive Services 리소스를 선택 (리소스가 없다면, Cognitive Services 리소스를 만들기)
  4. 선택한 Cognitive Services 리소스 페이지에서 "Keys 및 엔드포인트" 탭으로 이동
  5. "Key 1" 또는 "Key 2"를 선택하고 키 값을 복사
  6. .env 파일에 다음과 같이 작성하여 Azure 키를 저장

# reference:
  - RVC: https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI
