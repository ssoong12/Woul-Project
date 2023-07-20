import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./../../css/BoardDetail.css";

/**
 * 게시물 상세 페이지 컴포넌트
 */
function BoardDetail() {
  // URL에서 파라미터로 전달된 itemId 가져오기
  const { itemId } = useParams();

  // 선택된 게시물의 정보를 저장하는 상태 변수
  const [selectedItem, setSelectedItem] = useState(null);

  // 현재 로그인한 사용자 아이디 가져오기
  const inner_id = sessionStorage.getItem("inner_id");

  const navigate = useNavigate();

  useEffect(() => {
    /**
     * 서버에서 선택된 게시물의 정보를 가져와서 상태 변수에 설정
     */
    const fetchData = async () => {
      try {
        // itemId를 사용하여 서버에서 해당 게시물의 정보 가져오기
        const response = await axios.get(
          `http://127.0.0.1:8000/question/get-post/${itemId}/`
        );
        const { title, content, created_at, user_nickname } = response.data;
        setSelectedItem({
          title,
          content,
          created_at,
          user_nickname,
        });
      } catch (error) {
        console.error("게시물 정보를 불러오지 못했습니다.", error);
      }
    };

    fetchData();
  }, [itemId]);

  if (!selectedItem) {
    // 선택된 항목이 없는 경우에 대한 처리
    return <div className="board-noanswer">Loading...</div>;
  }

  const handleAnswerButtonClick = () => {
    navigate(`/board/answer/${itemId}`);
  };

  const handleCancelButtonClick = () => {
    navigate("/board");
  };

  const { title, content, created_at, user_nickname } = selectedItem;

  /**
   * 날짜 형식을 포맷하여 반환
   * @param {string} dateString - 날짜 문자열
   * @returns {string} 포맷된 날짜 문자열
   */
  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleString(undefined, options);
  };

  return (
    <div className="board-detail-container">
      <div className="board-detail-title">
        <span className="board-detail-title-text">제목:</span>
        <span className="board-detail-title-input">{title}</span>
      </div>

      <div className="board-detail-middle_container">
        <p className="board-detail-writer">작성자: {user_nickname}</p>
        <p className="board-detail-day">
          작성일: {getFormattedDate(created_at)}
        </p>
      </div>
      <p className="board-detail-content">{content}</p>
      <div className="board-detail-button">
        {inner_id === "907447047" ? (
          <button
            className="board-detail-answer-button"
            onClick={handleAnswerButtonClick}
          >
            답변하기
          </button>
        ) : null}

        <button
          className="board-detail-cancel-button"
          onClick={handleCancelButtonClick}
        >
          취소
        </button>
      </div>
    </div>
  );
}

export default BoardDetail;
