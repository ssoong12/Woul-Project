import { useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import '../css/Character_book.css';
import axios from 'axios';

/**
 * 
 * @returns 캐릭터 도감의 전체적인 기능반환
 */
function Character_book() {
    let [탭, 탭변경] = useState(1);


    return (
        <div>
            <Nav className="justify-content-center" variant="underline" defaultActiveKey={'link-0'} >

                <Nav.Item>
                    <Nav.Link onClick={() => { 탭변경(1) }}  eventKey="link-0">아기돼지삼형제</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link id='chracterbook_link2' onClick={() => { 탭변경(2) }} eventKey="link-1">미운오리새끼</Nav.Link>
                </Nav.Item>
                {/* <Nav.Item>
                    <Nav.Link onClick={() => { 탭변경(3) }} eventKey="link-2">The rocket book</Nav.Link>
                </Nav.Item> */}
            </Nav>
            <TabContent 탭={탭}/>
            
        </div>

    );
}
/**
 * 캐릭터 카드 수집 현황을 보여주는 함수
 * @param {*} props .fairy1: 첫번째 동화 캐릭터리스트정보 
 * @returns 캐릭터 카드 반환
 */
function Card(props) {
    return (<>
        {
            Object.entries(props.fairy1).map((entrie, idx) => {
                if (entrie[1] === true) {
                    return (
                        <div className='characterbook_card'>
                            <div className='characterbook_image1' key={idx}>
                                <img src={`img/character/${entrie[0]}.png`} alt="캐릭터그림 없음"></img>
                                <p>{entrie[0]}</p>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div className='characterbook_card'>
                            <div className='characterbook_image1'>
                                <img src="img/character/c1.PNG" alt="물음표"></img>
                                <p>{entrie[0]}</p>
                            </div>
                        </div>
                    )

                }
            })}
    </>)
}
/**
 * 동화 tab에 따라 캐릭터도감 정보를 전달 받고 Card함수에 전달해주는 함수
 * @param {*} props .탭: 동화 탭 번호
 * @returns 각 동화의 캐릭터 도감정보를 반환
 */
function TabContent(props) {

    let no = 0;
    let yes = 0;
    const inner_id = sessionStorage.getItem('inner_id');
    let [fairy1, setFairy1] = useState("");

    useEffect(()=>{
        if(props.탭==1){
                
            axios.post("http://localhost:8000/dashboard/get-word/",
                    {
                        userID: inner_id,
                        fairytaleID: 1
                    })
                    .then((res) => {
                        console.log(res);
                        setFairy1(res.data)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
            else if(props.탭==2){
                axios.post("http://localhost:8000/dashboard/get-word/",
                {
                    userID: inner_id,
                    fairytaleID: 2
                })
                .then((res) => {
                    console.log(res);
                    setFairy1(res.data)
                })
                .catch((error) => {
                    console.log(error)
                })               
            }
    },[props.탭])
    return (
        <div>
            {
                Object.values(fairy1).map((entrie, idx) => {
                    if (entrie === false) {
                        no += 1
                    } else {
                        yes += 1
                    }
                })
            }
            <div className='characterbook_info'>
                <img src='img/character/petard.png'alt='폭죽'></img>
                <p className='characterbook_text'>{no + yes}캐릭터 중 {yes}캐릭터를 수집했어요!</p>
            </div>

            
            <div className='characterbook_tabcontainer'>
                <Card fairy1={fairy1} />
            </div>
        </div>

    )

}
export default Character_book;