import "../Footer.css";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareFacebook } from "@fortawesome/free-brands-svg-icons";
import { faSquareTwitter } from "@fortawesome/free-brands-svg-icons";
import { faSquareInstagram } from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <div className="footer">
      <div className="footer_top">
        <div>
          <h1>Aivle_30</h1>
          <p>사업자등록번호 : 2023-01-31 | 대표자명 : 손경현</p>
          <p>대구 수성구 달구벌대로 3176(신매동 566)</p>
          <p>Copyright© 2023 KT Corp. All rights reserved.</p>
        </div>
        <div>
          <a href="/">
            <FontAwesomeIcon icon={faSquareFacebook} />
          </a>
          <a href="/">
            <FontAwesomeIcon icon={faSquareTwitter} />
          </a>
          <a href="/">
            <FontAwesomeIcon icon={faSquareInstagram} />
          </a>
        </div>
      </div>

      <div className="footer_bottom">
        <div>
          <h4>About</h4>
          <NavLink to="/">팀원소개</NavLink>
        </div>
        <div>
          <h4>Policy</h4>
          <NavLink to="/privacypolicy">개인정보 처리방침</NavLink>
        </div>
        <div>
          <h4>Content</h4>
          <NavLink to="/voicerecord">목소리만들기</NavLink>
          <NavLink to="/choicefairy">동화읽기</NavLink>
          <NavLink to="/character_book">도감</NavLink>
          <NavLink to="/dashboard">대시보드</NavLink>
          <NavLink to="/board">문의게시판</NavLink>
        </div>

        <div>
          <h4>Recruit</h4>
          <NavLink to="/">일하는 방식</NavLink>
          <NavLink to="/">함께하기</NavLink>
        </div>
        <div>
          <h4>Community</h4>
          <NavLink to="/">이벤트</NavLink>
        </div>
      </div>
    </div>
  );
}
export default Footer;
