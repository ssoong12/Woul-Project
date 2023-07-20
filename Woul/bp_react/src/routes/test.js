import { useParams } from "react-router-dom"
import './../css/Book.css'
import { useState, useEffect, useRef } from "react";
import Collectword from "./Collectword";
import SpeakLine from "./Dialogue";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Modal from "./Modal";
import './../css/test.css'

function TEST(props) {
    const pathBook = process.env.PUBLIC_URL + '/book';
    const [audio, setAudio] = useState(0)
    const [prevPage, setPrevPage] = useState(-1)
    const [nextPage, setNextPage] = useState(2)
    const [ useAutoPlay, setUseAutoPlay ] = useState(false)
    const [ viewModal, setViewModal ] = useState(false)
    const [ propsWord, setPropsWord ] = useState()
    const [selectedOption, setSelectedOption] = useState(null);

    let navigate = useNavigate();
    let location = useLocation();
    const currentURL = location.pathname;

    let voice = useSelector((state) => {return state.voice})

    const audioRef = useRef(null);

    const pron = { tree : '[ triː ]', face : '[ feɪs ]', shoes : '[ ʃuːz ]', 
                    block : '[ ˈblɑːk ]', hand : '[ ˈhænd ]', door : '[ ˈdoɚ ]' };

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
            {console.log(prevPage, nextPage)}
            {/* {console.log(voice.voiceID)} */}
            { viewModal == true ? 
            <div className=" div-flex">
                <div className="div-detection testmodal1">
                    <h4>{propsWord}를 수집해 보아요</h4>
                    <p>Step 1.</p>
                    <p>사진 찍기</p>
                    <p>Step 2.</p>
                    <p>발음해보기</p>
                    <p>Step 3.</p>
                    <p>단어 수집 완료!</p>
            {/* <Modal className='testModal' width={'50%'} height={'53%'} element={<>
                <img src={process.env.PUBLIC_URL + "/close.png"}
                        style={{ position: 'absolute', right : '10px', top : '10px', width : '20px', height : '20px', zIndex : '60', cursor : 'pointer' }}
                        onClick={ () => {setViewModal(false)} }/>
                <Collectword word={propsWord} pron={pron[propsWord]} id={'0'}/>
                </>
            } fade = {true}/> */}
            </div>
            <div className="div-detection testmodal2">
                사진을 찍어보아요~~
            {/* <Modal className='testModal' width={'50%'} height={'53%'} element={<>
                <img src={process.env.PUBLIC_URL + "/close.png"}
                        style={{ position: 'absolute', right : '10px', top : '10px', width : '20px', height : '20px', zIndex : '60', cursor : 'pointer' }}
                        onClick={ () => {setViewModal(false)} }/>
                <Collectword word={propsWord} pron={pron[propsWord]} id={'0'}/>
                </>
            } fade = {true}/> */}
            </div>
            </div>
            : null }

            <div className='non-flexible-audio' style={{ backgroundColor: 'transparent' }}>
                <audio ref={audioRef} src={pathBook + '/0/voice/' + voice.voiceID + '/' + audio + '.wav'} controls></audio>
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
                                <ShowWoul setPropsWord = {setPropsWord} setViewModal = {setViewModal} word = {'door'} left = {'35%'} top = {'55%'}></ShowWoul>
                                <img src={pathBook + "/0/img/0.png"} width={'100%'} alt="잉" />
                                <div className="page__number">1</div>
                            </div>

                            <div className="book__page book__page--4">
                                <div className="page__content">
                                    <div className="page__content-text">
                                    <FrameTop/>
                                        <p lang="en">The fire burns the wolf.</p>
                                        <p>늑대에게 불이 붙었어요.</p>
                                        <br />
                                        <p lang="en">“Ouch!” he says.</p>
                                        <p>아야!</p>
                                        <br />
                                        <p lang="en">He runs!</p>
                                        <p>늑대는 도망갔어요!</p>
                                        <br />
                                        <p lang="en">He does not come back.</p>
                                        <p>도망간 늑대는 돌아오지 않았답니다.</p>
                                        <FrameBottom/>
                                    </div>
                                    <div className="page__number">16</div>
                                </div>
                            </div>


                            <input type="radio" name="page_1314" id="page-13" onChange={(e) => { handleRadioChange(e); setPrevPage(prevPage - 2); setNextPage(nextPage - 2); }} value="option5" />

                            <input type="radio" name="page_1314" id="page-14" onChange={(e) => { handleRadioChange(e); setPrevPage(prevPage + 2); setNextPage(nextPage + 2); }} value="option6" />

                            <div className="book__page book__page--2" id="page_1314">
                                <div className="book__page-front">
                                    <div className="page__content">
                                        <div className="page__content-text">
                                        <FrameTop/>
                                            <p lang="en">The wolf huffs and puffs.</p>
                                            <p>늑대는 크게 숨을 들이마시고,</p>
                                            <p>후 하고 바람을 불었어요. </p>
                                            <br />
                                            <p lang="en">He cannot blow it down. </p>
                                            <p>하지만 집을 쓰러트릴 수 없었어요.</p>
                                            <br />
                                            <p lang="en">The wolf climbs up.</p>
                                            <p>늑대가 굴뚝을 오르기 시작했어요.</p>
                                            <br />
                                            <p lang="en">The pigs make a fire.</p>
                                            <p>아기돼지들은 굴뚝에 불을 붙였어요.</p>
                                            <FrameBottom/>
                                            <br />
                                        </div>
                                        <div className="page__number">14</div>
                                    </div>
                                </div>
                                <div className="book__page-back">
                                    <img src={pathBook + "/0/img/7.png"} width={'100%'} max-width={'100%'} alt="잉" />
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
                                            <p lang="en">The wolf goes to the brick house.</p>
                                            <p>늑대가 벽돌집에 나타탔어요.</p>
                                            <br />
                                            <p lang="en">“Little pig, let me in!”</p>
                                            <p>"아기돼지야, 나를 들여보내줘!"</p>
                                            <br />
                                            <p lang="en">“NO!” the pig says.</p>
                                            <p>"안돼!" 셋째돼지가 말했어요</p>
                                            <br />
                                            <p lang="en">“I won’t let you in.”</p>
                                            <p>"넌 들어올수 없어."</p>
                                            <FrameBottom/>
                                            
                                        </div>
                                        <div className="page__number">12</div>
                                    </div>
                                </div>
                                <div className="book__page-back">
                                    <img src={pathBook + "/0/img/6.png"} width={'100%'} max-width={'100%'} alt="잉" />
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
                                            <p lang="en">The wolf huffs and puffs. </p>
                                            <p>늑대는 크게 숨을 들이마시고,</p>
                                            <p>후 하고 바람을 불었어요. </p>
                                            <br />
                                            <p lang="en">He blows down the house. </p>
                                            <p>늑대는 나무집을 날려버렸어요.</p>
                                            <br />
                                            <p lang="en">The pig runs to the brick house.</p>
                                            <p>둘째돼지는 벽돌집으로 도망쳤어요.</p>
                                            <FrameBottom/>
                                        
                                        </div>
                                        <div className="page__number">10</div>
                                    </div>
                                </div>
                                <div className="book__page-back">
                                <ShowWoul setPropsWord = {setPropsWord} setViewModal = {setViewModal} word = {'block'} left = {'17%'} top = {'70%'}></ShowWoul>
                                    <img src={pathBook + "/0/img/5.png"} width={'100%'} max-width={'100%'} alt="잉" />
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
                                            <p lang="en">The wolf goes to the stick house.</p>
                                            <p>늑대가 나무집에 나타탔어요.</p>
                                            <br />
                                            <p lang="en">“Little pig, let me in!”</p>
                                            <p>"아기돼지야, 나를 들여보내줘!"</p>
                                            <br />
                                            <p lang="en">“NO!” the pig says.</p>
                                            <p>"안돼!" 둘째돼지가 말했어요</p>
                                            <br />
                                            <p lang="en">“I won’t let you in.”</p>
                                            <p>"넌 들어올수 없어."</p>
                                            
                                            <FrameBottom/>
                                        </div>
                                        <div className="page__number">8</div>
                                    </div>
                                </div>
                                <div className="book__page-back">
                                <ShowWoul setPropsWord = {setPropsWord} setViewModal = {setViewModal} word = {'tree'} left = {'15%'} top = {'40%'}></ShowWoul>
                                    <img src={pathBook + "/0/img/4.png"} width={'100%'} max-width={'100%'} alt="잉" />
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
                                            <p lang="en">The wolf huffs and puffs. </p>
                                            <p>늑대는 크게 숨을 들이마시고,</p>
                                            <p>후 하고 바람을 불었어요. </p>
                                            <br />
                                            <p lang="en">He blows down the house. </p>
                                            <p>늑대는 짚집을 날려버렸어요.</p>
                                            <br />
                                            <p lang="en">The pig runs to the stick house.</p>
                                            <p>첫째돼지는 나무집으로 도망쳤어요.</p>
                                            <FrameBottom/>
                                        
                                        </div>
                                        <div className="page__number">6</div>
                                    </div>
                                </div>
                                <div className="book__page-back">
                                <ShowWoul setPropsWord = {setPropsWord} setViewModal = {setViewModal} word = {'hand'} left = {'40%'} top = {'60%'}></ShowWoul>
                                    <img src={pathBook + "/0/img/3.png"} width={'100%'} max-width={'100%'} alt="잉" />
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
                                            <p lang="en">A wolf goes to the straw house. </p>
                                            <p>늑대 한마리가 짚으로 만들어진 집에 나타탔어요.</p>
                                            <br />
                                            <p lang="en">He is hungry.</p>
                                            <p>늑대는 배가 고팠어요</p>
                                            <br />
                                            <p lang="en">“Little pig, let me in.” </p>
                                            <p>"아기돼지야, 나를 들여보내줘."</p>
                                            <br />
                                            <p lang="en">“No!” the pig says.</p>
                                            <p>"안돼!" 첫째돼지가 말했어요.</p>
                                            <br />
                                            <p lang="en">“I won’t let you in.”</p>
                                            <p>"넌 들어올수 없어."</p>
                                            <FrameBottom/>


                                            
                                        
                                        </div>
                                        <div className="page__number">4</div>
                                    </div>
                                </div>
                                <div className="book__page-back">
                                <ShowWoul setPropsWord = {setPropsWord} setViewModal = {setViewModal} word = {'shoes'} left = {'35%'} top = {'60%'}></ShowWoul>
                                    <img src={pathBook + "/0/img/2.png"} width={'100%'} max-width={'100%'} alt="잉" />
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
                                        <FrameTop/>
                                            <p lang="en">Three pigs build three houses. </p>
                                            <p>세 마리의 돼지가 집을 짓고 있어요.</p>
                                            <br />
                                            <p lang="en">One is made of straw.</p>
                                            <p>하나는 짚으로 지어졌고,</p>
                                            <br />
                                            <p lang="en">One is made of sticks.  </p>
                                            <p>하나는 나무로 지어졌고,</p>
                                            <br />
                                            <p lang="en">One is made of bricks. </p>
                                            <p>하나는 벽돌로 지어졌어요.</p>
                                            <FrameBottom/>
                                        </div>
                                        <div className="page__number">2</div>
                                    </div>
                                </div>
                                <div className="book__page-back">
                                    <ShowWoul setPropsWord = {setPropsWord} setViewModal = {setViewModal} word = {'face'} left = {'33%'} top = {'50%'} ></ShowWoul >
                                    <img src={pathBook + "/0/img/1.png"} width={'100%'} max-width={'100%'} alt="잉" />
                                    <div className="page__number">3</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <label className='arrow-div btn_next' htmlFor={"page-" + nextPage}>
                { audio !== 7 ? <><div
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

function ShowWoul(props){
    // 페이지 크기는 360 x 511.2

    let imgSrc = process.env.PUBLIC_URL + '/book/0/woul/' + props.word + '.png'

    return (
        <div className='woul' style={{position: 'absolute', left : props.left, top : props.top, width : '120px', height : '120px',
        zIndex : '20'}} onClick={ () => { props.setPropsWord(props.word); props.setViewModal(true) }}>
            <img src={imgSrc} style = {{ width:'100%', height:'100%', cursor:'pointer', filter: 'drop-shadow(2px 2px 2px #3e3e3e)' }}
                ></img>


        </div>



    )
}


function FrameTop(){
    return (
        <img className='frame_top' src={process.env.PUBLIC_URL + '/frame3.png'}/>
    )
}

function FrameBottom(){
    return (
        <img className='frame_bottom' src={process.env.PUBLIC_URL + '/frame3.png'}/>
    )
}







export default TEST