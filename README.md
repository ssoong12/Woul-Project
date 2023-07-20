# Woul-Project
객체 탐지와 음성 인식 기술을 활용한 아동용 수집형 영단어 학습 웹 어플리케이션입니다.

## 프로젝트 배포
https://ai-8-30.bainble.tech/

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

## 화면 예시
### Index
![index](https://github.com/ssoong12/Woul-Project/assets/89440755/efc4bf03-5667-40f6-a729-31119f4f39e9)

### User
#### 로그인
![image](https://github.com/ssoong12/Woul-Project/assets/89440755/35509fb7-2622-492b-abc1-f07d66898bdb)
#### 개인 정보 수집 및 이용 동의
![image](https://github.com/ssoong12/Woul-Project/assets/89440755/18977193-656c-4738-a813-cb6698639361)
#### 회원가입
![image](https://github.com/ssoong12/Woul-Project/assets/89440755/b63ba7a3-0e69-48a0-925a-bf3c32f10002)

### Contents
#### 목소리 만들기
![image](https://github.com/ssoong12/Woul-Project/assets/89440755/b2f3d093-ed16-404c-90e4-8ce3d2e6433c)
#### 동화 읽기
![image](https://github.com/ssoong12/Woul-Project/assets/89440755/6a56094b-7bc8-4c35-b0db-0ae2b684896c)
  ##### 동화 페이지
  ![image](https://github.com/ssoong12/Woul-Project/assets/89440755/e54a1fcd-1e4d-4693-95cf-b035bbe8ab79)
  ##### 단어 수집(객체 인식, 음성 인식)
  ![image](https://github.com/ssoong12/Woul-Project/assets/89440755/a81d77bc-4b37-44dc-bf86-c51983247585)
  ##### 대사 따라하기(음성 인식)
  ![image](https://github.com/ssoong12/Woul-Project/assets/89440755/2621e974-1d93-4b7b-af6e-b033ecc6a20f)
#### 도감
![image](https://github.com/ssoong12/Woul-Project/assets/89440755/69c91418-34a5-43bc-986d-4c44483ce2f2)
#### 대시보드
![image](https://github.com/ssoong12/Woul-Project/assets/89440755/0f01c05b-c461-4bb6-9512-5a5dbc83ef6d)
#### 게시판
![image](https://github.com/ssoong12/Woul-Project/assets/89440755/2eb4f847-538c-40b0-8b51-38fe6699d416)
  ##### 게시글 작성
  ![image](https://github.com/ssoong12/Woul-Project/assets/89440755/68854484-a864-40d0-a6d7-307cf67ba979)
  ##### 게시글 상세 보기
  ![image](https://github.com/ssoong12/Woul-Project/assets/89440755/21cb190c-7ef4-47fb-836d-28c391149b75)
  ##### 게시글 답변 확인
  ![image](https://github.com/ssoong12/Woul-Project/assets/89440755/ca084932-7638-4c6e-a35d-dee73a06c69c)





