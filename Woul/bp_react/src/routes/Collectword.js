import { useState } from "react";
import { useRef } from "react";
import AudioRecord from "./record.js";
import registFile from "../registFile.js";
import Modal from "./Modal.js";
import './../css/CollectWord.css'
import djangoPath from "../path.js";
import axios from "axios";

/**
 * 
 * @param {*} props .word : {string} 수집 대상 word // .id : {int} book id // .pron : {string} 해당 단어 발음 기호
 * @returns 
 */
function Collectword(props) {
  let [selectedImage, setSelectedImage] = useState(null);
  let [isCollectImage, setIsCollectImage] = useState(0);
  let [isCollectPron, setIsCollectPron] = useState(0);
  let [btnText, setbtnText] = useState("말하기");
  let [audiofile, setAudioFile] = useState(null);
  // exellent >= 80, good >= 60, bad < 60
  let [scoreRange, setScoreRange] = useState();
  let [score, setScore] = useState()
  
  let [showComplete, setSC] = useState(false)

  const user_id = sessionStorage.getItem('inner_id');
  console.log(user_id)

  const [imgFile, setImgFile] = useState("");
  const imgRef = useRef();

  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgFile(reader.result);
    };
  };

    return (
        <div style={{ width : '100%', flex : '1' }}>
            { ( showComplete ) ? 
            <div style={{ width : '100%'}}>
            {/* <img src={process.env.PUBLIC_URL + '/good.png'} width={'40%'}/> */}
            {/* <img src={process.env.PUBLIC_URL + '/clap.png'} width={'40%'}/> */}
            <img src={process.env.PUBLIC_URL + '/Great.png'} width={'80%'}/>
            <h2 className="kr-title" style={{ marginTop : '10px' }}>단어를 수집했어요!</h2>
            </div>
            :<>
            <h5 className="kr-title">{props.word}를 수집해보아요.</h5>
            <div className="div-flex">
            <div className="div-detection">
              <div className="div-img">
                <p className="">사진을 찍어보아요! </p>
                <img className='img-detection' src={process.env.PUBLIC_URL + "/book/" + props.id + '/woul/' + props.word + ".png"} width='20%'/>
                <img className='img-detection' src={imgFile ? imgFile : process.env.PUBLIC_URL + "/img/collectword/image-gallery.png"} width='20%'/>
                </div>
            
            <input type='file' id='imageInput' onChange={(e) => {
                        saveImgFile()
                        setSelectedImage(e.target.files[0])
                    }}
                        accept='image/*'
                        ref={imgRef}></input>
                        <br></br>
            <button className="back_white_btn cw-btn" onClick={ () => {
                        setIsCollectImage(0)
                registFile('POST', '/detection/is-detect/', selectedImage, { ID : 'test', word : props.word })
                .then((res) => {
                  if (res.isdetect == true){
                    setIsCollectImage(1)
                  }
                  else {
                    setIsCollectImage(-1)
                  }
                })
            }}>제출</button>
            <br></br>
            {(isCollectImage !== 0) ? (isCollectImage == 1 
                ? <>
                <p>{props.word}가 맞아요!<br/>참 잘했어요! 😄</p>
                <img className="scoring" src = { process.env.PUBLIC_URL + "/img/collectword/correct.png"} width='10%'/>
                </>
                : <> 
                <p>{props.word}가 아니에요!<br/>다른 사진을 올려보아요. 😥</p>
                <img className="scoring"src = { process.env.PUBLIC_URL + "/img/collectword/wrong.png"} width='10%'/> 
                </>)
            : null }
            <br></br>
            </div>
              <div className='vertical' ></div>

            <div className="div-detection">
            <p className="">발음해보아요! </p>
            <img src={process.env.PUBLIC_URL + "/img/collectword/audio.png"} width='20%'/>
            <p>{props.word} {props.pron}</p>
            <audio src={process.env.PUBLIC_URL + "/book/" + props.id + "/pron/" + props.word + ".wav"} 
            controls id="myAudio"
            >오디오 지원되지 않는 브라우저</audio><br/>

            <AudioRecord audiofile = { audiofile } setAudioFile = { setAudioFile }></AudioRecord>
            <button className="back_white_btn cw-btn"
        onClick={() => {
          setIsCollectPron(0)
          registFile("POST", "/pronunce/word/", audiofile, {
            ID: user_id,
            word: props.word,
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
                    <img src = { process.env.PUBLIC_URL + "/img/collectword/correct.png"} width='10%'/>
                </>
                  : <> <br></br>
                <div className="div-flex">
                  <p className="div-detection p-scorerange p-score-bd">
                    Bad..</p>
                    <p className="div-detection p-score">점수 : {score}</p></div>
                    <img src = { process.env.PUBLIC_URL + "/img/collectword/wrong.png"} width='10%'/> 
                </>)
            : null }
      </div>
      
      </div>
      
      </>}
      { ( isCollectImage !== 1 || isCollectPron !== 1 ) ?
      <button disabled className="disabled_btn collect_btn" >단어 수집하기</button>
      :  ( showComplete !== true) ?
      <button className="back_white_btn"
        onClick={() => {
          axios({
            method: 'post',
            url: djangoPath + '/detection/collect-word',
            data: {
              ID: user_id,
              word: props.word
            }
          })
          .then(() => {
            setSC(true)
          })
        }}
      >단어 수집하기</button>
      : null
      }
    </div>
  );
}

export default Collectword;
