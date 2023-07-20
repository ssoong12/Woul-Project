import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import BoardWrite from "./routes/Board/BoardWrite";
import BoardAnswer from "./routes/Board/BoardAnswer";
import BoardList from "./routes/Board/BoardList";
import BoardFinish from "./routes/Board/BoardFinish";

function ParentComponent() {
  const [boardList, setBoardList] = useState([]);

  // 취소 클릭 시 수행 할 로직
  const handleCancel = () => {
    // 취소 시 실행되어야 할 내용
    console.log("게시글 작성을 취소하였습니다.");
  };

  // 게시글 등록 시 수행 할 로직
  const handleCreate = (newItem) => {
    // 게시글 등록 처리 로직
    console.log("새로운 게시글이 등록되었습니다.", newItem);
    setBoardList((prevList) => [...prevList, newItem]);
  };

  // 답변 업데이트 시 수행 할 로직
  const handleAnswerUpdate = (updatedItem) => {
    // boardList에서 해당 항목을 찾아 업데이트
    const updatedList = boardList.map((itemId) => {
      if (item.id === updatedItem.id) {
        return updatedItem;
      }
      return item;
    });

    // 업데이트된 boardList를 상태로 설정
    setBoardList(updatedList);
  };

  return (
    <div>
      <Switch>
        <Route path="/board/write">
          <BoardWrite onCancel={handleCancel} onCreate={handleCreate} />
        </Route>
        <Route path="/board/answer/:itemId">
          <BoardAnswer
            boardList={boardList}
            onAnswerUpdate={handleAnswerUpdate}
          />
        </Route>
        <Route path="/board/finish/:itemId">
          <BoardFinish boardList={boardList} />
        </Route>
        <Route path="/board">
          <BoardList boardList={boardList} />
        </Route>
      </Switch>
    </div>
  );
}

export default ParentComponent;
