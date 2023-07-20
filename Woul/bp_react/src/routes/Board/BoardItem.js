import React, { useState } from "react";

function BoardItem({ item, onSubmitAnswer }) {
  const isAnswered = item.answered;
  const answerContent = item.answer ? item.answer.content : "";

  const [answer, setAnswer] = useState(answerContent);

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleAnswerSubmit = () => {
    onSubmitAnswer(item.id, answer);
  };

  return (
    <div>
      <h3>제목: {item.title}</h3>
      <p>작성자: {item.user_id}</p>
      <p>작성일: {new Date(item.created_at).toLocaleDateString()}</p>
      <p>내용: {item.content}</p>

      {isAnswered ? (
        <div>
          <h4>답변</h4>
          <p>{answerContent}</p>
        </div>
      ) : (
        <div>
          <h4>답변하기</h4>
          <textarea onChange={handleAnswerChange} />
          <button onClick={handleAnswerSubmit}>답변 제출</button>
        </div>
      )}
    </div>
  );
}

export default BoardItem;
