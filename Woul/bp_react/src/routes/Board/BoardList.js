import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./../../css/BoardList.css";

/**
 * 게시판 목록 컴포넌트
 */
const BoardList = () => {
  // 현재 보여지는 게시물 목록 상태 관리 변수
  const [currentBoardList, setCurrentBoardList] = useState([]);

  // 현재 페이지 번호 상태 관리 변수
  const [currentPage, setCurrentPage] = useState(1);

  // 페이지당 보여지는 항목 수
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    /**
     * 서버에서 게시물 목록 가져오기
     */
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/question/get-post-list/"
        );
        const data = response.data;
        setCurrentBoardList(
          data.map((item) => ({
            ...item,
            answer: item.answered ? item.answer : null,
          }))
        );
      } catch (error) {
        console.error("게시물 목록을 불러오지 못했습니다.", error);
      }
    };

    fetchData();
  }, []);

  /**
   * 페이지 변경 처리 함수
   * @param {number} pageNumber - 변경된 페이지 번호
   */
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const sortedBoardList = [...currentBoardList].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  /**
   * 현재 페이지에서 시작하는 게시물 인덱스 반환
   * @returns {number} 시작 인덱스
   */
  const getPageStartIndex = () => {
    return (currentPage - 1) * itemsPerPage;
  };

  /**
   * 현재 페이지에서 끝나는 게시물 인덱스 반환
   * @returns {number} 끝 인덱스
   */
  const getPageEndIndex = () => {
    return currentPage * itemsPerPage;
  };

  /**
   * 주어진 날짜 문자열을 형식화된 날짜 문자열 변환
   * @param {string} dateString - 날짜 문자열
   * @returns {string} 형식화된 날짜 문자열 (ex "YYYY-MM-DD")
   */
  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const totalPages = Math.ceil(sortedBoardList.length / itemsPerPage);

  /**
   * 제목을 클릭했을 때의 수행하는 핸들러 함수
   * 답변이 있는 경우, 해당 게시물의 상세 페이지로 이동
   * @param {object} item - 클릭된 게시물
   */
  const handleClickTitle = (item) => {
    if (item.answered) {
      navigate(`/board/finish/${item.inner_id}`);
    }
  };

  return (
    <div className="board-list-container">
      <table>
        <thead className="board-list-header">
          <tr>
            <th>NO</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>답변여부</th>
          </tr>
        </thead>
        <tbody className="board-list-body">
          {sortedBoardList
            .slice(getPageStartIndex(), getPageEndIndex())
            .map((item, index) => (
              <React.Fragment key={item.inner_id}>
                <tr className="rounded-cell">
                  <td>
                    {sortedBoardList.length -
                      (currentPage - 1) * itemsPerPage -
                      index}
                  </td>
                  <td>
                    {item.answers ? (
                      <Link
                        to={`/board/finish/${item.inner_id}`}
                        onClick={() => handleClickTitle(item)}
                      >
                        {item.title}
                      </Link>
                    ) : (
                      <Link
                        to={{
                          pathname: `/board/detail/${item.inner_id}`,
                          state: { innerId: item.inner_id },
                        }}
                      >
                        {item.title}
                      </Link>
                    )}
                  </td>
                  <td>{item.nickname}</td>
                  <td>{getFormattedDate(item.created_at)}</td>
                  <td>
                    {item.answers ? (
                      <span>답변완료</span>
                    ) : (
                      <span>답변대기</span>
                    )}
                  </td>
                </tr>
                {!item.answered && (
                  <tr>
                    <td colSpan="5"></td>
                  </tr>
                )}
              </React.Fragment>
            ))}
        </tbody>
      </table>

      <div className="board-list-page">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              className={currentPage === pageNumber ? "active" : ""}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          )
        )}
      </div>

      <Link to="/board/write" className="board-list-write-button-link">
        <button className="board-list-write-button">글쓰기</button>
      </Link>
    </div>
  );
};

export default BoardList;
