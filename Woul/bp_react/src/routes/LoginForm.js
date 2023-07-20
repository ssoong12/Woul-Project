import { useState, useEffect } from "react";
import '../css/LoginForm.css';
import Join from '../routes/Join.js';
import { Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios';
import Header from "./Header";
import Footer from "./Footer";

//redux를 위한 import 선언
import { useDispatch } from "react-redux";
import { innerLoginUser } from "../store.js";

function LoginForm() {

    const [inputid, setInputId] = useState('');//입력받은 id
    const [inputpw, setInputPw] = useState('');//입력받은 pw
    const [pwValid, setPwValid] = useState(false);//pw 조건 확인 변수
    const [notAllow, setNotAllow] = useState(true);//버튼 비활성화를 위한 변수=> 여기에서 쓰진 않음
    let navigate = useNavigate();// 페이지 이동을 위한 변수
    let dispatch = useDispatch();//리덕스 함수 쓰기 위한


    /**
     * 비밀번호 조건 확인 함수
     * @param {*} e 이벤트변수
     */
    const hanlePassword = (e) => {
        // /^: 시작, $/:끝, *: 문자 또는 숫자가 0개 이상 나타남, 8자이상 16자이하 
        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[#?!@$ %^&*-+=]).{8,16}$/;
        if (regex.test(e.target.value)) {
            setInputPw(e.target.value);
            setPwValid(true);
        } else {
            setPwValid(false);
        }
    }
    
    /**
     * 최종 로그인 버튼 누르면 실행되는 함수 
     * @returns alert문
     */
    const onClickConfirmButton = () => {
        if (!inputid) {
            // ID 입력란에 아무것도 않넣었다면
            return alert('ID를 입력하세요.');
        }
        else if (!inputpw) {
            //PASSWORD입력란에 아무것도 않넣었다면
            return alert('PASSWORD를 입력하세요.');
        }
        else {
            // 서버에 post로 req.body형태로 id,passeord를 보내면
            axios({
                method:"post",
                url:"http://127.0.0.1:8000/sign/check-account/",
                data:{
                    id:inputid,
                    password:inputpw
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    console.log(res);
                    console.log('회원이 맞습니다.');
                    // inner id를 어디서든 쓰기 위해서 
                    dispatch(innerLoginUser(res.data));
                    // id,닉네임,inner_id를 다른페이지에서 쓰이기 위해서 session storage에 저장
                    sessionStorage.setItem('user_id',inputid);
                    sessionStorage.setItem('user_nickname',res.data.nickname);
                    sessionStorage.setItem('inner_id', res.data.inner_id)
                    // navigate('/') // 페이지 이동 코드1
                    document.location.href = "/"; //페이지 이동 코드2
                } 
            })
            .catch((error) => {
                console.log('아이디 또는 비밀번호를 잘못 입력했습니다.')
                alert('아이디 또는 비밀번호를 잘못 입력했습니다.')
            })
        }


    }
    return (

        <div className="LoginPage">
            <div className="loginpage_box">
                <p className='kr-title'>로그인</p>
                <div className="loginWrap1">
                    <input className="input" onChange={(e) => setInputId(e.target.value)} inputid={inputid} type="text" placeholder="ID" />
                </div>

                <div className="loginWrap2">
                    <input className="input" onChange={hanlePassword} inputpw={inputpw} type="password" placeholder="PASSWORD" />
                </div>

                <button className="login-btn" onClick={onClickConfirmButton}>Login</button>
                <p className="message">아직 아이디가 없으신가요?</p>
                <button onClick={() => { navigate('/agreement') }} className="join-btn" >Join</button>
                {/* <p className="message">간편 로그인</p>
                <img
                    alt="구글 로그인"
                    src="img/login_icon/googleLogin.PNG"
                    width="40"
                    height="40"
                    style={{ margin: '10px 15px 16px 24px' }}
                />
                <img
                    alt="페이스북 로그인"
                    src="img/login_icon/facebookLogin.PNG"
                    width="40"
                    height="40"
                    style={{ margin: '10px 15px 16px 24px' }}
                />
                <img
                    alt="네이버 로그인"
                    src="img/login_icon/naverLogin.PNG"
                    width="40"
                    height="40"
                    style={{ margin: '10px 15px 16px 24px' }}
                /> */}
            </div>
        </div>

    );
}
export default LoginForm;