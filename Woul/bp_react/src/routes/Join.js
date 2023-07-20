import { useState, useEffect } from "react";
import "../css/Join.css";
import axios from 'axios';
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";



function Join() {
  const [inputid, setInputId] = useState("");//입력받은 id
  const [inputnick, setInputNick] = useState("");//입력받은 닉네임
  const [inputpw, setInputPw] = useState("");//입력받은 비밀번호
  const [confirmpassword, setConfirmPassword] = useState("");//비밀번호 확인 변수

  const [idmessage,setIdMessage]=useState('');//아이디 중복확인 메세지를 위한 변수
  const [nickmessage,setNickMessage]=useState('');//닉네임 중복확인 메세지를 위한 변수

  const [pwValid, setPwValid] = useState(false);//비밀번호 조건확인 변수
  const [notAllow, setNotAllow] = useState(true);// join버튼 활성화를 결정하는 변수
  const[isIdTaken,setIsIdTaken]=useState(false);// 서버에서 전달 받은 닉네임 중복확인 유무
  const[isNickTaken,setIsNickTaken]=useState(false);// 서버에서 전달 받은 닉네임 중복확인 유무

  useEffect(() => {
    //비밀번호와 확인비밀번호가 일치하고 비밀번호 조건에 맞고 존재하지 않는 아이디 존재하지 않는 닉네임이면
    if (inputpw === confirmpassword && pwValid && !isIdTaken &&!isNickTaken) {
      //버튼 활성화  
      setNotAllow(false);
      return;
    }
    //버튼 비활성화
    setNotAllow(true);
  }, [pwValid, confirmpassword]);

  /**
   * 아이디 중복 확인 함수
   * @param {*} e 이벤트 변수
   */
  const handleId = (e) => {
    console.log(inputid);
    // 서버에 post로 req.params형태로 아이디를 전달해줌.
    axios({
      method:'post',
      url:'http://127.0.0.1:8000/sign/check-id/',
      params:{id:inputid},
    })
    .then((res) => {
        console.log(res);
        // 서버에서 전달해주는 is_exist:true => 이미 존재하는 아이디 
        setIsIdTaken(res.data.is_exist);
      })
      .catch((error) => {
        console.log(error)
      })
      if (inputid.length>0 &&! isIdTaken){
        setIdMessage('사용가능한 아이디입니다.')
      }

  };

  
  /**
   * 닉네임 중복 확인 함수
   * @param {*} e 
   */
  const handleNick = (e) => {
    console.log(inputnick);
    //서버에 post로 req.params 형태로 닉네임을 전달해줌
    axios({
      method:'post',
      url:'http://127.0.0.1:8000/sign/check-nickname/',
      params:{nickname:inputnick},
    })
      .then((res) => {
        console.log(res);
        setIsNickTaken(res.data.is_exist);
      })
      .catch((error) => {
        console.log(error)
      })

      if(inputnick.length>0 && !isNickTaken){
        setNickMessage('사용가능한 닉네임입니다.')
      }
  };


  /**
   * 비밀번호 조건확인 함수
   * @param {*} e 버튼이벤트함수
   */
  const handlePassword = async (e) => {
    setInputPw(e.target.value);

    const regex =/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[#?!@$ %^&*-+=]).{8,16}$/;
    if (regex.test(e.target.value)) {
      setInputPw(e.target.value);
      setPwValid(true);
    } else {
      setPwValid(false);
    }

  };
  
  /**
   * 확인 비밀번호 입력받는 함수
   * @param {*} e 버튼 이벤트변수
   */
  const onConfirmPasswordHandler = (e) => {
    setConfirmPassword(e.target.value);
  };

  // 최종 조인 버튼을 누르면 실행되는 함수
  /**
   * 
   * @returns alert문
   */
  const onClickJoinButton = () => {

    if (!inputid) {
      return alert('ID를 입력하세요.');
    }
    else if (!inputpw) {
        return alert('PASSWORD를 입력하세요.');
    }else if(!inputnick){
      return alert('닉네임을 입력하세요.')
    }else if(!confirmpassword){
      return alert('CONFRIM PASSWORD를 입력하세요.')
    }else{
      // post로 rea.body형태로 id,닉네임,비밀번호,관리자인지아닌지를 전달
      axios.post("http://127.0.0.1:8000/sign/create-account/",
      {
        id: inputid,
        nickname: inputnick,
        password: inputpw,
        is_admin:0
      })
      .then((res) => {
        if(res.status===201)
        {
          console.log(res);
          console.log("회원가입완료!")
          alert('회원가입이 되었습니다. 로그인 해주세요!')
          document.location.href = "/login"
        }
      })
      .catch((error) => {
        console.log(error)
      })
    }

  };

  
  return (
    <div className='JoinPage'>
      
      <div className="joinpage_box">
        <p className='kr-title'>회원가입</p>
        <div className="joinWrap1">
          <input className="input" onChange={(e)=>{setInputId(e.target.value)}} inputid={inputid} type="text" placeholder="ID" />
          <button className='join_confirm_btn1' onClick={handleId}>중복확인</button>
        </div>
        {
          isIdTaken?<div className="join_errorMessageWrap">이미 존재하는 아이디입니다</div>:
          <div className="join_errorMessageWrap">{idmessage}</div>
        }

        <div className="joinWrap2">
          <input className="input" onChange={(e)=>{setInputNick(e.target.value)}} inputnick={inputnick} type="text" placeholder="닉네임" />
          <button className='join_confirm_btn2' onClick={handleNick}>중복확인</button>
        </div>
        {    
          isNickTaken?<div className="join_errorMessageWrap">이미 존재하는 닉네임입니다</div>:
          <div className="join_errorMessageWrap">{nickmessage}</div>
        }

        <div className="joinWrap3">
          <input className="input" onChange={handlePassword} inputpw={inputpw} type="password" placeholder="PASSWORD" />
        </div>
        <div className="join_errorMessageWrap">
          {
            // 비밀번호 조건이 맞지않고 비밀번호 입력을 한자라도 했다면 아래 메세지 출력
          !pwValid && inputpw.length>0 && (
            <div >영문,숫자,특수문자 포함 (8~16자)</div>
          )}
        </div>

        <div className="joinWrap4">
          <input className="input" onChange={onConfirmPasswordHandler} confirmpassword={confirmpassword} inputpw={inputpw} type="password" placeholder="CONFIRM PASSWORD" />
        </div>

        <div className="join_errorMessageWrap">
          {
            // 비밀번호와 확인 비밀번호가 일치 하지 않고 확인비밀번호를 한자라도 적었으면 아래 메세지 출력
          inputpw !== confirmpassword && confirmpassword.length > 0 && (
            <div >입력하신 비밀번호와 동일하지 않습니다.</div>
          )}
        </div>

        <button className="join-btn2" onClick={onClickJoinButton} disabled={notAllow} >Join</button>

      </div>
    </div>
  )
        }
export default Join;
