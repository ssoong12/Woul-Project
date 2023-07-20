import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useEffect, useState } from "react";
import djangoPath from "../path.js";
import registFile from "../registFile.js";
import axios from "axios";
import ProgressBar from "react-bootstrap/ProgressBar";
import Header from "./Header.js";
import "./../css/Voicerecord.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "./Modal.js";

/**
 * 
 * @returns 목소리 합성 page
 */
function Voicerecord() {
  let [selectedFile, setSelectedFile] = useState(null);
  let [voiceName, setVoiceName] = useState(null);
  let [isSynthesis, setIsSynthesis] = useState(null);
  let [synTime, setSynTime] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  let [diffToMinute, setDiffToMinute] = useState(0);
  let [fade, setFade] = useState("");
  const [ vocalList, setvocalList ] = useState([0]);

  const user_id = sessionStorage.getItem("inner_id");
  console.log(user_id);
  console.log(vocalList.length)

  // 페이지 로드 시 isSynthesis 정보 받아옴
  useEffect(() => {
    // 등록된 목소리 개수 구하기
    axios({
      method: 'GET',
      url: djangoPath + '/voice/return/',
      params: {
        ID: user_id
      }
    })
      .then((res) => {
        setvocalList(res.data.vocalName)
      })

    // 현재 시간 구하기 yyyymmddhhmmss 형식
    let today = new Date();
    console.log(today);

    let year = today.getFullYear(); // 년도
    year = String(year);
    let month = today.getMonth() + 1; // 월
    {
      month < 10 ? (month = "0" + String(month)) : (month = String(month));
    }
    let date = today.getDate(); // 날짜
    {
      date < 10 ? (date = "0" + String(date)) : (date = String(date));
    }

    let hours = today.getHours(); // 시
    {
      hours < 10 ? (hours = "0" + String(hours)) : (hours = String(hours));
    }
    let minutes = today.getMinutes(); // 분
    {
      minutes < 10
        ? (minutes = "0" + String(minutes))
        : (minutes = String(minutes));
    }
    let seconds = today.getSeconds(); // 초
    {
      seconds < 10
        ? (seconds = "0" + String(seconds))
        : (seconds = String(seconds));
    }

    today = year + month + date + hours + minutes + seconds;
    console.log(today);
    setSynTime(today);

    axios({
      method: "GET",
      url: djangoPath + "/voice/status/",
      params: {
        ID: user_id,
      },
    }).then((res) => {
      // setIsSynthesis(1)
      // setSynTime('20230628101122')
      console.log(res.data);
      //
      // setSynTime(res.data.startTime)

      if (res.data.isSynthesis == 1) {
        setIsSynthesis(res.data.isSynthesis);
        setSynTime(res.data.startTime);
        // 20230629122138
        let syn_day = Number(res.data.startTime.slice(6, 8));
        let syn_hour = Number(res.data.startTime.slice(8, 10));
        let syn_minute = Number(res.data.startTime.slice(10, 2));

        setDiffToMinute(
          Number(date) * 1440 +
            Number(hours) * 60 +
            Number(minutes) -
            (syn_day * 1440 + syn_hour * 60 + syn_minute)
        );
      }
      // console.log(diff_to_minute)
    });
  }, [isSynthesis]);

  // setSynTime('20230628100000')

  return (
    <div className="container">
      {/* <button onClick={() => { setIsSynthesis(1); setFade('popUp') }}>테스트</button> */}
      {isSynthesis == 1 ? (
        <Modal
          width={"50%"}
          height={"70%"}
          element={
            <div className="voiceMaking">
              <FontAwesomeIcon
                icon="fa-regular fa-hourglass"
                size="6x"
                spin
                className="voiceMakingChild"
              />
              <WithLabelExample diffToMinute={diffToMinute}></WithLabelExample>
              <p className="voiceMakingChild">목소리를 만드는 중이에요!</p>
            </div>
          }
          fade={true}
        ></Modal>
      ) : null}
      <>
        <div className="voice_notice">
          <img
            className="voice_notice_img"
            src={process.env.PUBLIC_URL + "/img/voicerecord/chatbot.png"}
            width="75px"
          />
          <span className="voice_notice_txt">
            {"음성 합성 인공지능을 이용하여"} <br></br>{" "}
            {"원하는 목소리를 동화에 입혀드려요."}
          </span>
        </div>
        <Container className="voice_tutorial">
          <Row className="_row">
            <Col md={4}>
              <img
                className="voice_img"
                src={process.env.PUBLIC_URL + "/img/voicerecord/microphone.png"}
                width="75px"
              />
              <h5>
                10분 분량의
                <br />
                음성 녹음 파일이 필요해요. <br />( mp3, m4a, wav 형식만 사용할
                수 있어요! )
              </h5>
            </Col>
            <Col md={4}>
              <img
                className="voice_img"
                src={process.env.PUBLIC_URL + "/img/voicerecord/voice.png"}
                width="75px"
              />
              <h5>
                또박또박, 다양한 높낮이로
                <br />
                녹음해주실수록
                <br />
                목소리가 잘 만들어져요.
              </h5>
            </Col>
            <Col md={4}>
              <img
                className="voice_img"
                src={process.env.PUBLIC_URL + "/img/voicerecord/time-left.png"}
                width="75px"
              />
              <h5>
                목소리를 만드는 데에는
                <br />
                1시간이 걸려요.
              </h5>
            </Col>
          </Row>
        </Container>
        <input
          type="file"
          onChange={(e) => {
            setSelectedFile(e.target.files[0]);
          }}
          accept=".mp3, .wav, .m4a"
        ></input>
        <p className="name_hint_text">
          <br />
          파일을 업로드 후, 등록하실 목소리의 이름을 입력해주세요.
        </p>
        <input
          className="voice_input"
          onChange={(e) => {
            setVoiceName(e.target.value);
          }}
        ></input>
        { (selectedFile == null || voiceName == null || voiceName == "" || vocalList.length == 4) 
        ? <button className="disabled_voice_btn" disabled>등록</button>
      : <button
      className="voice_btn " 
      onClick={() => {
        console.log(selectedFile);
        console.log(URL.createObjectURL(selectedFile));

        
        // setSynTime('20230628101122')
        // axios params
        let paramList = { ID: user_id, vocalName: voiceName };

        registFile("POST", "/voice/test/", selectedFile, paramList)
        .then(
          (res) => {
            console.log("목소리 등록 성공!", res);
            setIsSynthesis(1);
            axios({
              method: "GET",
              url: djangoPath + "/voice/model/",
              params: {
                ID: user_id,
                vocalName: voiceName,
                epoch: 500,
              },
            }).then((res) => {
              console.log(res.data);
            })
          }
        )
        .catch(() => {
          setIsSynthesis(-1);
          console.log("이미 존재하는 목소리이름입니다. 다른 이름을 입력해주세요.")
        })
      }}
    >
      등록
    </button>
      }
        { vocalList.length == 4 ? 
          <div className="join_errorMessageWrap" style={{  'height' : '20px' , marginTop : "10px" }}>
          목소리 3개를 모두 등록했어요. 더 이상 등록할 수 없어요.
        </div >
          : null
        }
        {isSynthesis == -1 ? 
          <div className="join_errorMessageWrap" style={{  'height' : '20px' , marginTop : "10px" }}>
            이미 존재하는 목소리 이름입니다. 다른 이름을 입력해주세요.
          </div >
        :
          <div style={{ 'height' : '20px' }}></div>
        }
      </>
    </div>
  );
}

/**
 * 
 * @param {*} props .diffToMinute : {int} 현재 시각과 목소리 등록 시간의 차이(분) 
 * @returns 
 */
function WithLabelExample(props) {
  const now = props.diffToMinute;
  let percent = (now / 60) * 100;
  percent = percent.toFixed();

  return <ProgressBar now={`${percent}`} label={`${percent}%`} />;
}

export default Voicerecord;
