import { useEffect, useState } from "react";
import { useRef } from "react";
import AudioRecord from "./record.js";
import registFile from "../registFile.js";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "./Modal.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './../css/Dialogue.css'
import djangoPath from "../path.js";
import axios from "axios";

function Dialogue(props) {
  let [isCollectPron, setIsCollectPron] = useState(0);
  let [audiofile, setAudioFile] = useState(null);
  const [viewModal, setViewModal] = useState(false)
    // exellent >= 80, good >= 60, bad < 60
    let [scoreRange, setScoreRange] = useState();
    let [score, setScore] = useState()

  const user_id = sessionStorage.getItem('inner_id');

  let [index, setIndex] = useState(0);
  let navigate = useNavigate();

  let { id } = useParams();

  useEffect(()=> {

      setIsCollectPron(0)

  }, [ index ])


  // 대사들
  const dialogue = {
    0: [['“Little pig, let me in.”', '“아기돼지야, 나를 들여보내줘.”'],
    ['“No, I won’t let you in.”', '“안돼, 넌 들어올 수 없어.”']],
    1: [['‘Not any more. You’re a beautiful swan, like me.’', '‘더이상은 아니야. 너는 나처럼 아름다운 백조야’'],
    ['‘Do you want to be my friend?’', '‘내 친구가 될래?’']]
  }

  // 대사들
  const sentence = {
      0: ['Little pig, let me in!', 'NO! I won’t let you in.'],
      1: ['Not any more. You’re a beautiful swan, like me.', 'Do you want to be my friend?']
    }

  return (
    <div style={{ paddingTop: '10rem', paddingBottom: '7rem' }}>
      <div className='cont-dia'>
        {viewModal == true ?
          <Modal width={'50%'} height={'60%'} element={
            <div style={{ width: '100%' }}>
              {/* <img src={process.env.PUBLIC_URL + '/clap.png'} width={'30%'}/> */}
              <FontAwesomeIcon icon="fa-solid fa-hands-clapping" size="6x" bounce />
              <h5 style={{ marginTop: '10px' }}>동화를 모두 읽었어요!</h5><h5>동화읽기 페이지로 이동할게요.</h5>
              <div style={{ color: '#ffffff' }}>
                {setTimeout(() => { navigate('/choicefairy') }, 2500)}
              </div>
            </div>
          } fade={true} />
          : null}
        <h3 className='kr-title' style={{ paddingTop: '1rem', paddingBottom: '4rem' }}>동화속 주인공의 대사를 따라해보아요!</h3>

        <div className="div-flex">
        <div className="div-arrow">
            <img className="btn_prev" width={'30px'} src={process.env.PUBLIC_URL + '/left-arrow.png'}
              onClick={() => {
                if (index > 0 ) {
                  setIndex(index - 1)
                } 
              }}></img>
              </div>
          <div className="div-detection">
            <img src={process.env.PUBLIC_URL + "/book/" + id + "/dialogue/" + index + ".png"} width='300px' />
          </div>
          <div className="div-detection">
            <div className="div-dia">
            {/* <img className='frame_top' style={{ width : '100%' }} src={process.env.PUBLIC_URL + '/frame3.png'}/> */}
        
              <p>{dialogue[id][index][0]}</p>
              <p>{dialogue[id][index][1]}</p>
              {/* <img className='frame_bottom' style={{ width : '100%' }} src={process.env.PUBLIC_URL + '/frame3.png'}/> */}
            </div>
            <audio src={process.env.PUBLIC_URL + "/book/" + id + "/dialogue/" + index + ".wav"} controls id="myAudio">오디오 지원되지 않는 브라우저</audio><br />

            <AudioRecord audiofile={audiofile} setAudioFile={setAudioFile}></AudioRecord>


            <button className="back_white_btn cw-btn"
        onClick={() => {
          registFile("POST", "/pronunce/dialogue/", audiofile, {
            ID: user_id,
            sentence: sentence[id][index],
          })
          .then((res) => {
            console.log(res.pronScore)
            const pronscore = res.pronScore;
            setScore(pronscore)

            if (pronscore >= 60){
              setIsCollectPron(1)
              if (pronscore < 80){
                setScoreRange(1)
              }
              else {
                setScoreRange(0)
              }
            }
            else {
              setIsCollectPron(-1)
              setScoreRange(2)
            }
          });
        }}
      >
        제출
      </button>
      {/* <button onClick={() => { { setIsCollectPron(1); setScoreRange(0)}}}>테스트</button>
      <button onClick={() => { { setIsCollectPron(1); setScoreRange(1)}}}>테스트</button>
      <button onClick={() => { { setIsCollectPron(-1); setScoreRange(2)}}}>테스트</button> */}
      <div>
      {(isCollectPron !== 0) ? (isCollectPron == 1 
                ? <><br></br>
                { scoreRange == 0 
                  ? <div className="div-flex">
                  <p className="div-detection p-scorerange p-score-ex">
                    Exellent!!</p>
                    <p className="div-detection p-score">점수 : {score}</p></div>
                  : <div className="div-flex">
                  <p className="div-detection p-scorerange p-score-gd">
                    Good!</p>
                    <p className="div-detection p-score">점수 : {score}</p></div> }
                </>
                  : <> <br></br>
                <div className="div-flex">
                  <p className="div-detection p-scorerange p-score-bd">
                    Bad..</p>
                    <p className="div-detection p-score">점수 : {score}</p></div>
                </>)
            : null }
      </div>


          </div>
          <div className="div-arrow">
            <img className="btn_next" width={'30px'} src={process.env.PUBLIC_URL + '/right-arrow.png'}
              onClick={() => {
                if (index < 1) {
                  setIndex(index + 1)
                } else {
                  setViewModal(true)
                }
              }}></img>
            {/* <button onClick={ () => { 
                if (index < 1) {
                    setIndex(index+1)
                } else {
                    setViewModal(true)
                }
                } }>{ index < 2 ? '다음' : 'Finish!' }</button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dialogue;
