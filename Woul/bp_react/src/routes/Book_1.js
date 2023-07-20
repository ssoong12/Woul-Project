import { useParams } from "react-router-dom"
import './../css/Book.css'
import { useState, useEffect, useRef } from "react";
import Collectword from "./Collectword";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Modal from "./Modal";

/**
 * 
 * @returns 동화 읽기, 단어 수집을 할 수 있는 페이지 
 */
function Book_1() {
    const pathBook = process.env.PUBLIC_URL + '/book';
    const [audio, setAudio] = useState(0)
    const [prevPage, setPrevPage] = useState(-1)
    const [nextPage, setNextPage] = useState(2)
    const [useAutoPlay, setUseAutoPlay] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const [propsWord, setPropsWord] = useState()

    const [selectedOption, setSelectedOption] = useState(null);

    const frameurl = "url(./../public/frame.png)";

    let navigate = useNavigate();
    let location = useLocation();
    const currentURL = location.pathname;

    let voice = useSelector((state) => {return state.voice})


    const pron = {
        egg: '[ eɡ ]', leaf: '[ liːf ]', duck: '[ dʌk ]',
        water: '[ |wɑːtə(r) ]', cloud: '[ klaʊd ]', dog: '[ dɔːɡ ]', ice: '[ aɪs ]'
    };

    const audioRef = useRef(null);


    useEffect(() => {
        const timeout = setTimeout(() => {
            if (audioRef.current && useAutoPlay) {
                audioRef.current.muted = true;
                audioRef.current.play();
                audioRef.current.muted = false;
            }
        }, 1000); // 2초 후에 재생

        return () => {
            clearTimeout(timeout);
        };
    }, [audio, useAutoPlay]);

    const handleRadioChange = (event) => {
        setSelectedOption(event.target.value);
        console.log('Selected value:', event.target.value);
    };

    return (
        <div onClick={() => setUseAutoPlay(true)} style={{ paddingTop : '8rem' }}>
            { viewModal == true ? 
                <Modal width={'55%'} height={'83%'} element={<>
                    <img src={process.env.PUBLIC_URL + "/close.png"}
                            style={{ position: 'absolute', right : '10px', top : '10px', width : '20px', height : '20px', zIndex : '60', cursor : 'pointer' }}
                            onClick={ () => {setViewModal(false)} }/>
                    <Collectword word={propsWord} pron={pron[propsWord]} id={'1'}/>
                    </>
                } fade = {true}/>

                : null}
            {console.log(prevPage, nextPage)}
            <div className='non-flexible-audio' style={{ backgroundColor: 'transparent'}}>
                <audio ref={audioRef} src={pathBook + '/1/voice/' + voice.voiceID + '/' + audio + '.wav'} controls></audio>
            </div>
            <div className="parent_container">

                <label className='arrow-div btn_prev' htmlFor={"page-" + prevPage}>
                    <div
                        onClick={() => {
                            if (audio > 0) { setAudio(audio - 1) }
                        }}>
                            <img src={process.env.PUBLIC_URL + "/left-arrow.png"} style={{ width: '20px'}}></img>
                            <p style={{ marginTop : '10px' }}>이전 페이지</p></div>
                </label>
                
                <div className="book-div">

                    <div className="cover">
                        <div className="book">
                            <div className="book__page book__page--1">
                                <ShowWoul setPropsWord={setPropsWord} setViewModal={setViewModal} word={'egg'} left={'18%'} top={'40%'}></ShowWoul>
                                <img src={pathBook + "/1/img/0.png"} width={'100%'} alt="잉" />
                                <div className="page__number">1</div>
                            </div>

                            <div className="book__page book__page--4">
                                <div className="page__content">
                                    <div className="page__content-text">
                                    <FrameTop/>
                                        <p lang="en">"Do you want to be my friend?"  </p>
                                        <p>"내 친구가 될래?"</p>
                                        <br />
                                        <p lang="en">"Yes!" he smiled. </p>
                                        <p>"좋아!"라며 미운오리가 웃었어요. </p>
                                        <br />
                                        <p lang="en">All the other animals watched as </p>
                                        <p lang="en">    the two swans flew away, friends forever.</p>
                                        <p>다른 동물들은 두 마리의 백조가 날아가는 </p>
                                        <p>    것을 지켜보았고, 둘은 영원한 친구가 되었습니다. </p>
                                        <FrameBottom/>


                                    </div>
                                    <div className="page__number">18</div>
                                </div>
                            </div>

                            <input type="radio" name="page_1516" id="page-15" onChange={(e) => { handleRadioChange(e); setPrevPage(prevPage - 2); setNextPage(nextPage - 2); }} value="option5" />

                            <input type="radio" name="page_1516" id="page-16" onChange={(e) => { handleRadioChange(e); setPrevPage(prevPage + 2); setNextPage(nextPage + 2); }} value="option6" />

                            <div className="book__page book__page--2" id="page_1516">
                                <div className="book__page-front">
                                    <div className="page__content">
                                        <div className="page__content-text">
                                        <FrameTop/>
                                            <p lang="en">"Who’s that?" </p>
                                            <p>"이게 누구지?"</p>
                                            <br />
                                            <p lang="en"> "It’s you." </p>
                                            <p lang="en">    said another beautiful, white bird.</p>
                                            <p>그건 바로 너야. </p>
                                            <p>    라고 또다른 아름다운 하얀 새가 말했어요.</p>
                                            <br />
                                            <p lang="en">"Me? But I’m an ugly duckling.."  </p>
                                            <p>"나?' 하지만 나는 못생긴 오리인걸.." </p>
                                            <br />
                                            <p lang="en">"Not any more. You’re a beautiful swan, like me."  </p>
                                            <p>"더이상은 아니야. 너는 나처럼 아름다운 백조야"</p>
                                            <FrameBottom/>
                                        </div>
                                        <div className="page__number">16</div>
                                    </div>
                                </div>
                                <div className="book__page-back">
                                    <ShowWoul setPropsWord={setPropsWord} setViewModal={setViewModal} word={'cloud'} left={'28%'} top={'63%'}></ShowWoul>
                                    <img src={pathBook + "/1/img/8.png"} width={'100%'} max-width={'100%'} alt="잉" />
                                    <div className="page__number">17</div>
                                </div>
                            </div>


                            <input type="radio" name="page_1314" id="page-13" onChange={(e) => { handleRadioChange(e); setPrevPage(prevPage - 2); setNextPage(nextPage - 2); }} value="option5" />

                            <input type="radio" name="page_1314" id="page-14" onChange={(e) => { handleRadioChange(e); setPrevPage(prevPage + 2); setNextPage(nextPage + 2); }} value="option6" />

                            <div className="book__page book__page--2" id="page_1314">
                                <div className="book__page-front">
                                    <div className="page__content">
                                        <div className="page__content-text">
                                        <FrameTop/>
                                            <p lang="en">Then spring came. </p>
                                            <p>그리고 봄이 왔어요. </p>
                                            <br />
                                            <p lang="en">The ugly duckling left the barn and </p>
                                            <p lang="en">    went back to the pond.</p>
                                            <p>미운 오리는 헛간을 떠나</p>
                                            <p>    연못으로 돌아갔어요. </p>
                                            <br />
                                            <p lang="en">He was very thirsty and </p>
                                            <p lang="en">    put his beak into the water.  </p>
                                            <p>미운오리는 매우 목이 말라서 </p>
                                            <p>    부리를 물 속으로 넣었어요. </p>
                                            <br />
                                            <p lang="en">He saw a beautiful, white bird!  </p>
                                            <p>그리고 아름답고 하얀 새를 보았답니다.</p>
                                            <br />
                                            <p lang="en">‘Wow!’ he said.</p>
                                            <p> '와우!'</p>
                                            <FrameBottom/>

                                        </div>
                                        <div className="page__number">14</div>
                                    </div>
                                </div>
                                <div className="book__page-back">
                                <ShowWoul setPropsWord={setPropsWord} setViewModal={setViewModal} word={'water'} left={'70%'} top={'36%'}></ShowWoul>
                                    <img src={pathBook + "/1/img/7.png"} width={'100%'} max-width={'100%'} alt="잉" />
                                    <div className="page__number">15</div>
                                </div>
                            </div>

                            <input type="radio" name="page_1112" id="page-11" onChange={(e) => { handleRadioChange(e); setPrevPage(prevPage - 2); setNextPage(nextPage - 2); }} value="option5" />

                            <input type="radio" name="page_1112" id="page-12" onChange={(e) => { handleRadioChange(e); setPrevPage(prevPage + 2); setNextPage(nextPage + 2); }} value="option6" />

                            <div className="book__page book__page--2" id="page_1112">
                                <div className="book__page-front">
                                    <div className="page__content">
                                        <div className="page__content-text">
                                        <FrameTop/>
                                            <p lang="en">It started to get cold. It started to snow!</p>
                                            <p>날이 추워지고, 눈이 내리기 시작했어요!</p>
                                            <br />
                                            <p lang="en">The ugly duckling found an empty barn </p>
                                            <p lang="en">   and lived there. </p>
                                            <p>미운오리는 비어있는 헛간을 발견했고,</p>
                                            <p>    그 곳에서 살았어요.</p>
                                            <br />
                                            <p lang="en">He was cold, sad and alone.</p>
                                            <p>미운오리는 춥고, 슬프고 외로웠답니다. </p>
                                            <FrameBottom/>
                                        </div>
                                        <div className="page__number">12</div>
                                    </div>
                                </div>
                                <div className="book__page-back">
                                    <ShowWoul setPropsWord={setPropsWord} setViewModal={setViewModal} word={'leaf'} left={'70%'} top={'65%'}></ShowWoul>
                                    <img src={pathBook + "/1/img/6.png"} width={'100%'} max-width={'100%'} alt="잉" />
                                    <div className="page__number">13</div>
                                </div>
                            </div>

                            <input type="radio" name="page_910" id="page-9" onChange={(e) => { handleRadioChange(e); setPrevPage(prevPage - 2); setNextPage(nextPage - 2); }} value="option5" />

                            <input type="radio" name="page_910" id="page-10" onChange={(e) => { handleRadioChange(e); setPrevPage(prevPage + 2); setNextPage(nextPage + 2); }} value="option6" />

                            <div className="book__page book__page--2" id="page_910">
                                <div className="book__page-front">
                                    <div className="page__content">
                                        <div className="page__content-text">
                                        <FrameTop/>
                                            <p lang="en">‘Go away!’ said the dog. </p>
                                            <p>'저리 가!' 개가 말했어요. </p>
                                            <br />
                                            <p lang="en">‘Go away!’ said the sheep. </p>
                                            <p>'저리 가!' 양이 말했어요. </p>
                                            <br />
                                            <p lang="en">‘Go away!’ said the cow.  </p>
                                            <p>'저리 가!' 소가 말했어요. </p>
                                            <br />
                                            <p lang="en">‘Go away!’ said the cat. </p>
                                            <p> '저리 가!' 고양이가 말했어요. </p>
                                            <br />
                                            <p lang="en">No one wanted to be his friend.  </p>
                                            <p>아무도 그의 친구가 되고 싶어하지 않았어요.</p>
                                            <FrameBottom/>
                                        </div>
                                        <div className="page__number">10</div>
                                    </div>
                                </div>
                                <div className="book__page-back">
                                    <ShowWoul setPropsWord={setPropsWord} setViewModal={setViewModal} word={'ice'} left={'25%'} top={'66%'}></ShowWoul>
                                    <img src={pathBook + "/1/img/5.png"} width={'100%'} max-width={'100%'} alt="잉" />
                                    <div className="page__number">11</div>
                                </div>
                            </div>


                            <input type="radio" name="page_78" id="page-7" onChange={(e) => { handleRadioChange(e); setPrevPage(prevPage - 2); setNextPage(nextPage - 2); }} value="option5" />

                            <input type="radio" name="page_78" id="page-8" onChange={(e) => { handleRadioChange(e); setPrevPage(prevPage + 2); setNextPage(nextPage + 2); }} value="option6" />

                            <div className="book__page book__page--2" id="page_78">
                                <div className="book__page-front">
                                    <div className="page__content">
                                        <div className="page__content-text">
                                        <FrameTop/>
                                            <p lang="en">Nobody wanted to play with him.</p>
                                            <p>아무도 그와 놀고 싶어하지 않았어요. </p>
                                            <br />
                                            <p lang="en">"Go away." said his brothers and sisters. </p>
                                            <p>"저리가." 그의 형제 자매들이 말했어요.</p>
                                            <br />
                                            <p lang="en">"You’re ugly!"  </p>
                                            <p>"넌 못생겼어!"</p>
                                            <br />
                                            <p lang="en">The ugly duckling was sad.  </p>
                                            <p>미운 오리 새끼는 슬펐답니다. </p>
                                            <br />
                                            <p lang="en">So he went to find some new friends.  </p>
                                            <p>그래서 오리는 새로운 친구들을 찾으러 갔어요.  </p>
                                            <FrameBottom/>
                                        </div>
                                        <div className="page__number">8</div>
                                    </div>
                                </div>
                                <div className="book__page-back">
                                    <ShowWoul setPropsWord={setPropsWord} setViewModal={setViewModal} word={'dog'} left={'67%'} top={'30%'}></ShowWoul>
                                    <img src={pathBook + "/1/img/4.png"} width={'100%'} max-width={'100%'} alt="잉" />
                                    <div className="page__number">9</div>
                                </div>
                            </div>




                            <input type="radio" name="page_56" id="page-5" onChange={(e) => { handleRadioChange(e); setPrevPage(prevPage - 2); setNextPage(nextPage - 2); }} value="option5" />
                            <input type="radio" name="page_56" id="page-6" onChange={(e) => { handleRadioChange(e); setPrevPage(prevPage + 2); setNextPage(nextPage + 2); }} value="option6" />

                            <div className="book__page book__page--2" id="page_56">
                                <div className="book__page-front">
                                    <div className="page__content">
                                        <div className="page__content-text">
                                        <FrameTop/>
                                            <p lang="en">Then the big egg started to crack.  </p>
                                            <p>그리고 큰 알이 깨지기 시작했어요. </p>
                                            <br />
                                            <p lang="en">Bang, bang, bang!  </p>
                                            <p>탁, 탁, 탁! </p>
                                            <br />
                                            <p lang="en">One big, ugly duckling came out. </p>
                                            <p>크고 못생긴 오리 한 마리가 나왔어요.</p>
                                            <br />
                                            <p lang="en">‘That’s strange,’ thought Mummy Duck. </p>
                                            <p>'이 아이는 조금 이상하군.' 엄마 오리가 생각했어요.</p>
                                            <FrameBottom/>
                                        </div>
                                        <div className="page__number">6</div>
                                    </div>
                                </div>
                                <div className="book__page-back">
                                
                                    <img src={pathBook + "/1/img/3.png"} width={'100%'} max-width={'100%'} alt="잉" />
                                    <div className="page__number">7</div>
                                </div>
                            </div>



                            <input type="radio" name="page_34" id="page-3" onChange={(e) => { handleRadioChange(e); setPrevPage(prevPage - 2); setNextPage(nextPage - 2); }} value="option3" />

                            <input type="radio" name="page_34" id="page-4" onChange={(e) => { handleRadioChange(e); setPrevPage(prevPage + 2); setNextPage(nextPage + 2); }} value="option4" />

                            <div className="book__page book__page--2" id="page_34">
                                <div className="book__page-front">
                                    <div className="page__content">
                                        <div className="page__content-text">
                                        <FrameTop/>
                                            <p lang="en">One day, the five little eggs started to crack.  </p>
                                            <p>어느 날 다섯 개의 작은 알이 깨지기 시작했어요. </p>
                                            <br />
                                            <p lang="en">Tap, tap, tap!  </p>
                                            <p>탭, 탭, 탭! </p>
                                            <br />
                                            <p lang="en">Five pretty, yellow baby ducklings came out.  </p>
                                            <p>예쁜 노란 아기 오리 다섯 마리가 나왔어요. </p>
                                            <FrameBottom/>
                                        </div>
                                        <div className="page__number">4</div>
                                    </div>
                                </div>
                                <div className="book__page-back">
                                    <ShowWoul setPropsWord={setPropsWord} setViewModal={setViewModal} word={'duck'} left={'25%'} top={'55%'}></ShowWoul>
                                    <img src={pathBook + "/1/img/2.png"} width={'100%'} max-width={'100%'} alt="잉" />
                                    <div className="page__number">5</div>
                                </div>
                            </div>








                            {/* 두번째 페이지 */}
                            <input type="radio" name="page_12" id="page-1" onChange={(e) => { handleRadioChange(e); setPrevPage(prevPage - 2); setNextPage(nextPage - 2); }} value="option1" />

                            <input type="radio" name="page_12" id="page-2" onChange={(e) => { handleRadioChange(e); setPrevPage(prevPage + 2); setNextPage(nextPage + 2); }} value="option2" />

                            <div className="book__page book__page--2" id="page_12">
                                <div className="book__page-front">
                                    <div className="page__content">
                                        <div className="page__content-text">
                                            <FrameTop></FrameTop>
                                            <p lang="en">Mummy Duck lived on a farm.  </p>
                                            <p>엄마 오리가 농장에 살고 있었습니다. </p>
                                            <br />
                                            <p lang="en">In her nest, she had five little eggs</p>
                                            <p lang="en">    and one big egg.</p>
                                            <p>그녀의 둥지에는 다섯 개의 작은 알과 </p>
                                            <p>    하나의 큰 알이 있었습니다.</p>
                                            <FrameBottom></FrameBottom>
                                        </div>
                                        <div className="page__number">2</div>
                                    </div>
                                </div>
                                <div className="book__page-back">
                                    <img src={pathBook + "/1/img/1.png"} width={'100%'} max-width={'100%'} alt="잉" />
                                    <div className="page__number">3</div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </div>

                <label className='arrow-div btn_next' htmlFor={"page-" + nextPage}>
                { audio !== 8 ? <><div
                        onClick={() => { setAudio(audio+1) }}>
                            <img src={process.env.PUBLIC_URL + "/right-arrow.png"} style={{ width: '20px'}}></img>
                            </div><p style={{ marginTop : '10px' }}>다음 페이지</p></>
                        // 대사 말하기 페이지 넘어가기
                        : <><div
                        onClick={() => { navigate(currentURL + '/dialogue') }}>
                            <img src={process.env.PUBLIC_URL + "/right-arrow.png"} style={{ width: '20px'}}></img>
                            </div><p style={{ marginTop : '10px' }}>주인공 되어보기</p></>
                    }
                </label>
                <div style={{clear: 'left'}}></div>

            </div>
        </div>
    )

}

/**
 * 
 * @param {*} props .word : {string} 해당 워울 word //  .setPropsWord : {setstate func} 단어 수집 페이지에서 사용할 word  // .setViewModal : {setstate func} 모달을 보여주는 flag
 * // .left, .top : {string} 해당 페이지 내에서 워울을 배치할 절대 좌표 (%)
 * @returns 해당 단어를 수집할 수 있는 modal 창을 띄우는 워울
 */
function ShowWoul(props) {
    // 페이지 크기는 360 x 511.2

    let imgSrc = process.env.PUBLIC_URL + '/book/1/woul/' + props.word + '.png'

    return (
        <div className='woul' style={{
            position: 'absolute', left: props.left, top: props.top, width: '120px', height: '120px',
            zIndex: '20'
        }} onClick={() => { props.setPropsWord(props.word); props.setViewModal(true) }}>
            <img src={imgSrc} style={{ width: '100%', height: '100%', cursor: 'pointer', filter: 'drop-shadow(2px 2px 2px #3e3e3e)' }}
            ></img>


        </div>



    )
}

/**
 * 
 * @returns 동화 content 위쪽 frame
 */
function FrameTop(){
    return (
        <img className='frame_top' src={process.env.PUBLIC_URL + '/frame3.png'}/>
    )
}

/**
 * 
 * @returns 동화 content 아래쪽 frame
 */
function FrameBottom(){
    return (
        <img className='frame_bottom' src={process.env.PUBLIC_URL + '/frame3.png'}/>
    )
}

export default Book_1