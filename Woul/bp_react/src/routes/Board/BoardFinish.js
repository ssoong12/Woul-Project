import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./../../css/BoardFinish.css";

/**
 * 게시물 답변 완료 페이지 컴포넌트
 */
const BoardFinish = () => {
  // useParams 사용하여 URL 매개변수에서 itemId를 추출하여 변수에 할당
  const { itemId } = useParams();

  // 선택된 항목을 상태로 관리하기 위해 useState 사용
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    /**
     * 서버에서 선택된 게시물의 정보를 가져와서 상태 변수에 설정
     */
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/question/get-post/${itemId}/`
        );
        const { title, content, created_at, user_nickname, answer } =
          response.data;
        setSelectedItem({ title, content, created_at, user_nickname, answer });
      } catch (error) {
        console.error("게시물을 불러오지 못했습니다.", error);
      }
    };

    fetchData();
  }, [itemId]);

  if (!selectedItem) {
    // 선택된 항목이 없는 경우에 대한 처리
    return <div className="board-noanswer">Loading...</div>;
  }

  const { title, content, created_at, user_nickname, answer } = selectedItem;

  return (
    <div className="board-finish-first-container">
      <h2 className="board-finish-title">
        <span className="board-finish-text">제목:</span>
        <span className="board-finish-input">{title}</span>
      </h2>
      <div className="board-finish-middle_container">
        <p className="board-finish-writer">작성자: {user_nickname}</p>
        <p className="board-finish-day">
          작성일: {new Date(created_at).toLocaleDateString()}
        </p>
      </div>
      <p className="board-finish-content">{content}</p>

      {answer && (
        <div className="board-finish-seconde-container">
          <h4>답변</h4>
          <p>{answer.content}</p>
        </div>
      )}

      <Link to="/board" style={{ textDecoration: "none" }}>
        <button className="board-finish-button">목차로 돌아가기</button>
      </Link>
    </div>
  );
};

export default BoardFinish;
