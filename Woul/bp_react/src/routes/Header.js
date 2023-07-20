import "../Header.css";
import { BrowserRouter, Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect} from "react";


/**
 * 
 * @param {*} props .token: 로그인 유무
 * @returns 헤더의 기능 반환
 */
function Header(props) {

  let [clicked, setClicked] = useState(false);// 메뉴 바 클릭 변수
  const [isHeaderVisible, setHeaderVisible] = useState(true);// 스크롤을 내리면 헤더가 안보이게 하기 위한 변수

  // useEffect(() => {
  //   const handleScroll = () => {
  //     // 현재 스크롤 위치를 확인합니다.
  //     const scrollPosition = window.scrollY;

  //     // 스크롤 위치가 일정 값보다 크면 헤더를 숨깁니다.
  //     if (scrollPosition > 150) {
  //       setHeaderVisible(false);
  //     } else {
  //       setHeaderVisible(true);
  //     }
  //   };
  //   // scroll 이벤트 리스너를 추가합니다.
  //   window.addEventListener('scroll', handleScroll);

  //   // 컴포넌트가 언마운트될 때 리스너를 제거합니다.
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);
/**
 * 로그아웃 시 session storage에 있는 값 삭제
 * @param {*} e 로그아웃버튼이벤트
 */
  const DeleteLogitem = (e) => {
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("user_nickname");
    sessionStorage.removeItem("inner_id");
    document.location.href = "/";
  };
  // 헤더 메뉴 바 클릭 시 스타일 함수
  // 카멜표기법으로 작성해야함
  const activestyle = {
    color: 'var(--first-color)',
    textDecoration: "underline",
    textDecorationThickness: "2px",
    textUnderlineOffset: "8px",
  };
  // 헤더 메뉴바 기본 스타일
  const deactivestyle = {
    color: "black",
  };
  // 클릭 시 클릭변수 변경
  const handleClick = () => {
    setClicked(!clicked);
  };
  return (
    <nav className={isHeaderVisible ?"NavbarItems":'NavbarItems hidden'}>
      <Link
        to="/"
        style={{ textDecoration: "none", color: "black", cursor: "pointer" }}>
        <img src='img/main/Logo.png' alt='로고'className="nav__logo"></img>
      </Link>
      <div className="menu__icons" onClick={handleClick}>
        <FontAwesomeIcon icon={clicked ? faX : faBars} />
      </div>
      <ul className={clicked ? "nav__menu active" : "nav__menu"}>
        <li className="nav__item">
          <NavLink
            to="/"
            // style={({ isActive }) => {
            //   return isActive ? activestyle : deactivestyle;
            // }}
            className="nav__link"
          >
            Home
          </NavLink>
        </li>
        <li className="nav__item">
          <NavLink
            to="/voicerecord"
            // style={({ isActive }) => {
            //   return isActive ? activestyle : deactivestyle;
            // }}
            className="nav__link"
          >
            목소리만들기
          </NavLink>
        </li>
        <li className="nav__item">
          <NavLink
            to="/choicefairy"
            // style={({ isActive }) => {
            //   return isActive ? activestyle : deactivestyle;
            // }}
            className="nav__link"
          >
            동화읽기
          </NavLink>
        </li>
        <li className="nav__item">
          <NavLink
            to="/character_book"
            // style={({ isActive }) => {
            //   return isActive ? activestyle : deactivestyle;
            // }}
            className="nav__link"
          >
            도감
          </NavLink>
        </li>
        <li className="nav__item">
          <NavLink 
            to="/dashboard"
            // style={({ isActive }) => {
            //   return isActive ? activestyle : deactivestyle;
            // }} 
            className="nav__link">
            대시보드
          </NavLink>
        </li>
        <li className="nav__item">
          <NavLink 
          to="/board" 
          // style={({ isActive }) => {
          //   return isActive ? activestyle : deactivestyle;
          // }} 
          className="nav__link">
            문의게시판
          </NavLink>
        </li>
        {props.token ? (
          <button className="main-join-btn" onClick={DeleteLogitem}>
            로그아웃
          </button>
        ) : (
          <Link to="/login">
            <button className="main-join-btn">로그인</button>
          </Link>
        )}
      </ul>
    </nav>
  );
}

export default Header;
