import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import BoardList from "./routes/Board/BoardList.js";
import BoardWrite from "./routes/Board/BoardWrite.js";
import "./App.css";
import LoginForm from "./routes/LoginForm.js";
import Join from "./routes/Join.js";
import ChoiceFairy from "./routes/ChoiceFairy.js";
import Character_book from "./routes/Character_book.js";
import Voicerecord from "./routes/Voicerecord.js";
import Collectword from "./routes/Collectword.js";
import Record from "./routes/record.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "bootstrap";
import BoardDetail from "./routes/Board/BoardDetail";
import BoardFinish from "./routes/Board/BoardFinish";
import BoardAnswer from "./routes/Board/BoardAnswer";
import Dialogue from "./routes/Dialogue";
import Dashboard from "./routes/Dashboard.js";
import TEST from "./routes/test.js";
import Agreement from "./routes/Agreement.js";

import Header from "./routes/Header.js";
import "./Header.css";
import Footer from "./routes/Footer.js";
import Book_0 from "./routes/Book_0.js";
import Book_1 from "./routes/Book_1.js";
import { useSelector } from "react-redux";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faTwitter, faFontAwesome } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrivateRoute from "./PrivateRoute.js";
import Privacypolicy from "./routes/Privacypolicy.js";
library.add(fas, far, fab);

library.add(fas, faTwitter, faFontAwesome);

function App() {
  const [boardList, setBoardList] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const token = sessionStorage.getItem("user_id");
  
  
    useEffect(() => {
      window.scrollTo(0, 0); // 스크롤을 제일 위로 이동
    }, []);

  // 게시글 생성 함수
  const handleCreate = (newItem) => {
    const newBoardItem = {
      id: Date.now().toString(),
      title: newItem.title,
      content: newItem.content,
      created_date: new Date(),
      answered: false,
      answer: null,
    };

    setBoardList((prevList) => [...prevList, newBoardItem]);
  };

  // 게시글 삭제 함수
  const handleDelete = (itemId) => {
    const updatedBoardList = boardList.filter((item) => item.id !== itemId);
    setBoardList(updatedBoardList);
  };

  // 답변 제출 함수
  const handleSubmitAnswer = (itemId, answerContent) => {
    const updatedBoardList = boardList.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          answered: true,
          answer: {
            content: answerContent,
          },
        };
      }
      return item;
    });
    setBoardList(updatedBoardList);
  };

  // 답변 완료 함수
  const handleAnswerUpdate = (updatedItem) => {
    // 게시판 리스트에서 해당 아이템을 업데이트
    const updatedList = boardList.map((item) => {
      if (item.id === updatedItem.id) {
        return updatedItem;
      }
      return item;
    });
    setBoardList(updatedList);
  };


  return (
    <div className="App">
      <Header token={token} />

      <Routes>
        <Route
          path="/board"
          element={<PrivateRoute component={
            <BoardList
              boardList={boardList}
              onAnswerUpdate={handleAnswerUpdate}
              onDelete={handleDelete}
              onCreate={handleCreate}
            />}authenticated={token}/>
          }
        />
        <Route
          path="/board/write"
          element={<BoardWrite onCreate={handleCreate} boardList={boardList} />}
        />
        <Route
          path="/board/detail/:itemId"
          element={<BoardDetail boardList={boardList} />}
        />
        <Route
          path="/board/answer/:itemId"
          element={
            <BoardAnswer
              boardList={boardList}
              onAnswerUpdate={handleAnswerUpdate}
              onSubmitAnswer={handleSubmitAnswer}
            />
          }
        />
        <Route
          path="/board/finish/:itemId"
          element={<BoardFinish boardList={boardList} />}
        />

        <Route
          path="/"
          element={
            <>
              <div className="main1">
                <div className="textwrap1">
                  <h1 className="p-title en-title">Make</h1>
                  <h1 className="p-title en-title">learning fun!</h1>
                  <p>영어를 보다 재밌게!</p>
                  <p>동화를 읽고, 단어를 수집하며 학습해요</p>
                </div>
                <div className="imagewrap1">
                    <img src="img/main/main1.png" alt="character"></img>
                </div>
              </div>
              <div className="middle kr-title">
                  <p>무엇을 할 수 있나요?</p>
              </div>
              <div className="main2">
                <div className="imagewrap2">
                  <img src="img/main/main2.png" alt="main2"></img>
                </div>
                <div className="textwrap2">
                  <h1 className="p-title kr-title">목소리 커스터마이징</h1>
                  <p>부모님, 친구 등 좋아하는 목소리로</p>
                  <p>동화를 읽을 수 있어요</p>
                </div>
              </div>
              <div className="main3">
                <div className="textwrap1-1">
                  <h1 className="p-title kr-title">발음 향상</h1>
                  <p>재미있는 동화를 듣고 읽으면서</p>
                  <p>영어 단어 발음을 향상 시킬 수 있어요</p>
                </div>
                <div className="imagewrap1-1">
                  <img src="img/main/main3.png" alt="main3"></img>
                </div>
              </div>
              <div className="main4">
                <div className="imagewrap2">
                  <img src="img/main/main4.png" alt="main4"></img>
                </div>
                <div className="textwrap2-1">
                  <h1 className="p-title kr-title">단어 수집</h1>
                  <p>동화를 읽으며 사진을 찍고</p>
                  <p>귀여운 캐릭터를 수집할 수 있어요</p>
                </div>
              </div>
              {
                <Link to="/choicefairy">
                  <button className="start-btn">동화 읽으러 가기</button>
                </Link>
              }
            </>
          }
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/join" element={<Join />} />
        <Route path='/agreement' element={<Agreement/>} />
        <Route path='/privacypolicy' element={<Privacypolicy/>}/>
        <Route path="/character_book" element={<PrivateRoute component={<Character_book/>}authenticated={token}/>}/>
        <Route path="/voicerecord" element={<PrivateRoute component={<Voicerecord />}authenticated={token}/>} />
        {/* <Route path='/collectword' element={<Collectword word = {'tree'}/>}/> */}
        <Route path="/record" element={<PrivateRoute component={<Record />}authenticated={token}/>} />
        <Route path="/book/0" element={<PrivateRoute component={<Book_0 />}authenticated={token}/>} />
        <Route path="/book/:id/dialogue" element={<PrivateRoute component={<Dialogue />}authenticated={token}/>} />
        <Route path="/book/1" element={<PrivateRoute component={<Book_1 />}authenticated={token}/>} />
        <Route path="/book/:id/dialogue" element={<PrivateRoute component={<Dialogue />}authenticated={token}/>} />
        <Route path="/dashboard" element={<PrivateRoute component={<Dashboard />}authenticated={token}/>} />
        <Route path="/choicefairy" element={<PrivateRoute component={<ChoiceFairy />}authenticated={token}/>} />
        

        <Route path="/test" element={<TEST/>}/>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;