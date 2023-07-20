import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../../css/BoardWrite.css";

/**
 * 게시물 작성 컴포넌트
 * @param {function} onCreate - 게시물 생성 시 호출되는 콜백 함수
 */
function BoardWrite({ onCreate }) {
  // 제목 상태 관리 변수
  const [title, setTitle] = useState("");

  // 내용 상태 관리 변수
  const [content, setContent] = useState("");

  // 현재 사용자의 ID 가져오기
  const user_id = sessionStorage.getItem("inner_id");

  const navigate = useNavigate();

  /**
   * 제목 입력값 변경 시 호출되는 핸들러 함수
   * @param {object} e - 이벤트 객체
   */
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  /**
   * 내용 입력값 변경 시 호출되는 핸들러 함수
   * @param {object} e - 이벤트 객체
   */
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  /**
   * 게시물 등록 함수
   * @param {object} e - 이벤트 객체
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.length > 0 && content.length > 0) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/question/create-post/",
          {
            user_id: user_id,
            title: title,
            content: content,
            created_at: new Date().toISOString(),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const newItem = response.data;

        console.log("데이터베이스에 저장됨:", newItem);

        // onCreate 호출하여 게시물 등록 작업 수행
        onCreate(newItem);

        navigate("/board");
      } catch (error) {
        console.error("게시물을 저장할 수 없습니다.", error);
        if (error.response) {
          console.log("응답 데이터:", error.response.data);
          console.log("응답 상태 코드:", error.response.status);
          console.log("응답 헤더:", error.response.headers);
        }
      }
    }
  };

  /**
   * 게시물 작성 취소 함수
   */
  const handleCancel = () => {
    navigate("/board");
  };

  return (
    <form className="board-write-container" onSubmit={handleSubmit}>
      <div className="board-write-title">
        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <div className="board-write-content">
        <label htmlFor="content"></label>
        <textarea id="content" value={content} onChange={handleContentChange} />
      </div>
      <div className="board-write-button">
        <button
          className="board-write-submit"
          type="submit"
          disabled={title.length === 0 || content.length === 0}
        >
          등록
        </button>
        <button
          className="board-write-cancel"
          type="button"
          onClick={handleCancel}
        >
          취소
        </button>
      </div>
    </form>
  );
}

export default BoardWrite;
