import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./../../css/BoardAnswer.css";

/**
 * 게시물에 대한 답변 작성 컴포넌트
 * @param {Array} boardList - 게시물 목록
 * @param {function} onAnswerUpdate - 답변이 업데이트되었을 때 호출되는 콜백 함수
 */
function BoardAnswer({ boardList, onAnswerUpdate }) {
  // 현재 URL의 파라미터에서 itemId 값을 가져옴
  const { itemId } = useParams();

  // 선택된 항목을 상태로 관리하는 selectedItme 상태와 설정 함수
  const [selectedItem, setSelectedItem] = useState(null);

  // 답변 내용을 상태로 관리하는 answerContent 상태와 설정 함수
  const [answerContent, setAnswerContent] = useState("");

  // sessionStorage에서 "inner_id" 키의 값을 가져와 현재 사용자의 ID로 설정
  const user_id = sessionStorage.getItem("inner_id");

  const navigate = useNavigate();

  useEffect(() => {
    /**
     * 게시물 정보를 서버에서 가져와서 선택된 게시물 보여주기
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
        console.error("게시물 정보를 불러오지 못했습니다.", error);
      }
    };

    fetchData();
  }, [itemId]);

  /**
   * 답변 내용 변경 시 호출되는 핸들러 함수
   * @param {object} e - 이벤트 객체
   */
  const handleAnswerChange = (e) => {
    setAnswerContent(e.target.value);
  };

  /**
   * 답변 제출 함수
   */
  const handleSubmit = () => {
    if (answerContent.trim().length < 1) {
      // 답변 내용 한 글자 이상인지 확인
      alert("답변 내용을 한 글자 이상 입력해주세요");
      return;
    }

    const newAnswer = {
      content: answerContent,
      user_id: user_id,
    };

    axios
      .post(
        `http://127.0.0.1:8000/question/create-answer/${itemId}/`,
        newAnswer
      )
      .then((response) => {
        // 답변 저장 성공 했을 때
        const updatedItem = {
          ...selectedItem,
          answered: true,
          answer: newAnswer,
        };
        onAnswerUpdate(updatedItem);
        navigate("/board");
      })
      .catch((error) => {
        // 오류 처리 로직
        console.error("답변 저장 오류 : ", error);
      });
  };

  /**
   * 취소 버튼 클릭 시 호출되는 함수
   */
  const handleCancelButtonClick = () => {
    navigate("/board");
  };

  if (!selectedItem) {
    // 선택된 항목이 없는 경우에 대한 처리
    return <div className="board-noanswer">Loading...</div>;
  }

  return (
    <div className="board-answer-container">
      <h2 className="board-answer-title">제목: {selectedItem.title}</h2>
      <div className="board-answer-middle_container">
        <p className="board-answer-writer">
          작성자: {selectedItem.user_nickname}
        </p>
        <p className="board-answer-day">
          작성일: {new Date(selectedItem.created_at).toLocaleDateString()}
        </p>
      </div>
      <p className="board-answer-content">{selectedItem.content}</p>

      {selectedItem.answer ? (
        <div className="board-end_answer-container">
          <p> {selectedItem.answer.content}</p>
        </div>
      ) : (
        <div className="board-wirte_answer-container">
          <h4 className="board-write_answer_write">답변작성</h4>
          <div className="board-answer-input">
            <textarea onChange={handleAnswerChange} />
          </div>
          <div className="board-answer-button">
            <button
              className="board-answer_submit-button"
              onClick={handleSubmit}
            >
              답변 저장
            </button>
            <button
              className="board-answer_cancel-button"
              onClick={handleCancelButtonClick}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardAnswer;
