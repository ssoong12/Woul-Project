import React, { useEffect, useState } from "react";
import Slider from 'react-slick'
import data from "../Data.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/ChoiceFairy.css";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer.js";
import Header from "./Header.js";
import Modal from "./Modal.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useDispatch } from "react-redux";
import { changeVoiceID } from "../store.js";
import { height } from "@mui/system";
import axios from "axios";
import djangoPath from "../path.js";
/**
 * react-slick이 porps을 통해 className,style,onClick을 받음
 * 다음 화살표 함수
 * 커스텀 할 수 있는 옵션
 * @param {*} props 
 * @returns 클래스이름,스타일,클릭이벤트 반환
 */
function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}
/**
 * react-slick이 porps을 통해 className,style,onClick을 받음
 * 이전 화살표 함수
 * 커스텀 할 수 있는 옵션
 * @param {*} props 
 * @returns 
 */
function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

function ChoiceFairy() {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    initialSlide: 0,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />

  };

  const [viewModal, setViewModal] = useState(false)
  const [index, setIndex] = useState()
  const [voice, setVoice] = useState(0)
  const arrCursor = ['pointer', 'pointer', '', '', '']
  let navigate = useNavigate();
  let dispatch = useDispatch()
  const user_id = sessionStorage.getItem('inner_id');
  const [ vocalList, setvocalList ] = useState();
  const [ vocalIDList, setvocalIDList ] = useState();

  const handleChange = (event) => {
    console.log(event.target.value)
    // props.handleVoiceChange(event.target.value)
    dispatch(changeVoiceID(event.target.value))
    // dispatch(changeVoiceID(vocalIDList[event.target.value]))
    setVoice(event.target.value)
  };


  useEffect(() => {
    setVoice(0)
    axios({
      method: 'GET',
      url: djangoPath + '/voice/return/',
      params: {
        ID: user_id
      }
    })
      .then((res) => {
        console.log(res)
        setvocalList(res.data.vocalName)
        setvocalIDList(res.data.voiceID)
      })
  }, [])

  return (
    <div>

      {viewModal == true ?
        <Modal width={'300px'} height={'450px'} element={<div style={{ position : 'relative', width : '100%', height : '100%' }}>
          <img src={process.env.PUBLIC_URL + "/close.png"}
            style={{ position: 'absolute', right: '10px', top: '10px', width: '20px', height: '20px', zIndex: '60', cursor: 'pointer' }}
            onClick={() => { setViewModal(false) }} />
            <p style={{ marginTop : '30%' }}>목소리를 설정해주세요.</p>
          <Box sx={{ minWidth: 400 }}>
            <FormControl style={{ position: 'absolute', left: '50%', top: '50%', width: '200px', transform: 'translate(-50%, -50%)' }}>
              <InputLabel id="demo-simple-select-label">목소리</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="목소리"
                value={voice}
                onChange={handleChange}
              >
                {vocalList.map((item, idx) => (
                    <MenuItem value={idx} key={idx}>{item}</MenuItem>
                ))}
                {/* // <MenuItem value={0}>기본 목소리</MenuItem>
                // <MenuItem value={1}>엄마 목소리</MenuItem> */}
              </Select>
            </FormControl>
          </Box>
          <button className="back_white_btn" style={{ marginTop : '80%' }} onClick={ () => {
            navigate('/book/' + index)
          }}>확인</button>
        </div>} fade={true}>
        </Modal>
        : null}
      <div className="choicefairy__padding">

        <img src='img/fairy/dinosaur.png'alt="공룡키즈"></img>
        <h2>동화를 선택해주세요</h2>
        <img src='img/fairy/princess.png'alt="공주키즈"></img>
      </div>
      <div className='choicefairy__carousel'>
        <Slider {...settings}>
          {data.map((item, idx) => (
            <div className='carousel-item' key={idx} >
              <img src={item.imagelink} alt={item.title} style={{ cursor : arrCursor[idx] }} onClick={() => {
                if (idx == 0 || idx == 1) {
                  setViewModal(true)
                  setIndex(idx)
                }
              }}></img>
              <p>{item.title}</p>
            </div>
          ))}
        </Slider>
      </div>
    </div>

  );

}
export default ChoiceFairy;
