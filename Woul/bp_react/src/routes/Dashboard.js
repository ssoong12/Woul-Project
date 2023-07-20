import '../css/Dashboard.css'
import axios from 'axios'

import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,//line(x axis),bar
    LinearScale,//line(y axis),bar
    Tooltip,
    Legend,
    LineElement,//line
    PointElement//line
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'
import { useSelector } from 'react-redux';
import Header from './Header';
import Footer from './Footer';


ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    LineElement,
    PointElement
)

function Dashboard() {
    const user = useSelector((state) => state.inner_login);//리덕스에서 inner id 가져오기 -> 이거 안씀
    let [usercollect, setUserCollect] = useState(0);//사용자 단어 수집률 변수
    let [gencollect, setGenCollect] = useState(0);// 사용자외 단어 수집률 변수
    let [userpronoun, setUserPronoun] = useState(0);//사용자 발음점수 변수
    let [genepronoun, setGenPronoun] = useState(0);// 사용자 외 발음점수 변수
    let [islogin, setIsLogin] = useState(false);// 로그인 유무 변수
    let [rank, setRank] = useState([]);//상위 10명 유저들 담기 위한 변수
    let [user_rank, setUserRank] = useState(0);//사용자의 등수
    let [isclick,setIsClick]=useState(false);//대시보드 3개 박스 클릭을 위한 변수
    let [population,setPopulation]=useState(0);// 총 가입한 사용자들 수 



    const user_id = sessionStorage.getItem('user_id');//세션스토리지에서 key값이 user_id인 value값 
    const user_innerid = sessionStorage.getItem('inner_id');//세션스토리지에서 key값이 inner_id value값 
    const user_nickname = sessionStorage.getItem('user_nickname');//세션스토리지에서 key값이 user_nickname value값 


    useEffect(() => {
        // user_id값이 없다면 로그인을 안한 상태임
        if (user_id !== null) {
            setIsLogin(true);
        }
    }, [user_id]);


    /**
     * 단어수집률 보드를 클릭 했을 때 실행되는 함수
     * post로 req.body형태로 사용자의 inner_id를 서버에게 전달
     * 사용자의 단어수집률과 사용자외 단어수집률 정보 받음
     * @param {*} e 단어수집률 보드 클릭이벤트
     */
    const onClickDash1 = (e) => {
        axios({
            method: "post",
            url: "http://127.0.0.1:8000/dashboard/get-word-collection-rate/",
            data: {
                user_id: user_innerid
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    console.log(res);
                    setUserCollect(res.data.user_rate);
                    setGenCollect(res.data.general_rate);
                }
            })
    }

    /**
     * 발음 정확도 보드를 클릭 했을 때 실행되는 함수
     * post로 req.body형대로 사용자의 inner_id를 서버에게 전달
     * 사용자의 발음정확도 평균과 사용자외 발음정확도 평균 정보를 받음
     * @param {*} e 발음정확도보드 클릭이벤트
     */
    const onClickDash2 = (e) => {
        axios({
            method: "post",
            url: "http://127.0.0.1:8000/dashboard/get-pronounciation-accuracy-rate/",
            data: {
                user_id: user_innerid
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    console.log(res);
                    setUserPronoun(res.data.user_score);
                    setGenPronoun(res.data.general_score);
                }
            })
    }

    /**
     * 상위 10랭킹 보드 클릭 했을 때 실행되는 함수
     * post로 req.body형태로 사용자의 inner_id를 서버에게 전달
     * 사용자의 현 등수, 전체 사용자 수, 상위 10명의 정보를 받음
     * @param {*} e 랭킹보드 클릭이벤트
     */
    const onClickDash3 = (e) => {
        axios({
            method: "post",
            url: "http://127.0.0.1:8000/dashboard/get-rankings/",
            data: {
                user_id: user_innerid
            },
        })
            .then((res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    setRank(res.data.ranks);
                    setUserRank(res.data.user_rank);
                    setPopulation(res.data.population);
                }
            })
            .catch((error) => {
                console.log(error)
            })
        setIsClick(true);

    }
    // 막대 그래프 데이터 생성
    const bar_data = {
        labels: [''],
        datasets: [
            {
                label: user_nickname,
                type: 'bar',
                data: [usercollect],
                backgroundColor: '#0064FF',
                borderColor: '#0064FF',
                borderWidth: 0.5,
                barThickness: 60,
            },
            {
                label: 'The others',
                type: 'bar',
                data: [gencollect],
                backgroundColor: 'rgb(211, 211, 211)',
                borderColor: 'rgb(211, 211, 211)',
                borderWidth: 1,
                barThickness: 60,
            },
        ],
    }
    // 가로로 보여주는 옵션
    const bar_options = {
        indexAxis: 'y',
    }
    // 여기에서 선 그래프는 쓰지 않음 
    const line_data = {
        labels: [''],
        datasets: [
            {
                label: user_nickname,
                type: 'bar',
                data: [userpronoun],
                backgroundColor: '#0064FF',
                borderColor: '#0064FF',
                borderWidth: 0.5,

            },
            {
                label: 'The others',
                type: 'bar',
                data: [genepronoun],
                backgroundColor: 'rgb(211, 211, 211)',
                borderColor: 'rgb(211, 211, 211)',
                borderWidth: 0.5,
            },
        ],
    }

   
    return (

        <div className="dashboard_page">
            <div className="dashboard_top">
                {
                    islogin ?
                        <h1>{user_nickname}의 학습현황이 궁금하다면 박스를 클릭해보세요 📬</h1>
                        : null
                }
                {
                    islogin&&isclick ?
                        <h1>{user_nickname}(이)는 {population}명 중 {user_rank}등입니다 </h1>
                        : null
                }
            </div>
            <div className='dashboard_mid'>
                <div className="dashboard_mid1">
                    <div className='dashboard_item1_title'>
                        <p>단어수집률</p>
                    </div>
                    <div className="dashboard_item1">
                        <div className='dashboard__wrapper1' onClick={onClickDash1}>
                            
                            {
                                islogin ?
                                    <Bar
                                        data={bar_data}
                                        options={bar_options}
                                    ></Bar> :
                                    null
                            }

                        </div>
                    </div>
                    <div className='dashboard_item2_title'>
                        <p>발음정확도</p>
                    </div>
                    <div className="dashboard_item2">
                        <div className='dashboard__wrapper2' onClick={onClickDash2}>
                            {
                                islogin ?
                                    <Bar
                                        data={line_data}
                                    ></Bar> :
                                    null
                            }

                        </div>
                    </div>
                </div>
                <div className='dashboard_mid2'>

                    <div className='dashboard_item3_1'>
                        <div className='dashboard_wrapper3_1'>
                            <div className='dashboard_display'>
                                <img src='img/character/fire.png' alt='불타오르네'></img>
                                <p>상위 10명 어린이들!</p>
                            </div>



                        </div>
                        
                    </div>
                    <div className="dashboard_item3" onClick={() => { onClickDash3() }}>
                        <div className='dashboard__wrapper3'>
                            
                            <div className='rank_menu0'>순위</div>
                            <div className='rank_menu1'>닉네임</div>
                            <div className='rank_menu2'>단어수집률</div>
                            <div className='rank_menu3'>발음정확도</div>
                            {
                                islogin&&isclick ?
                                    rank.map((item, idx) => {
                                        return (
                                            <>
                                                <div className={(idx + 1) === user_rank ? 'rank_item_first' : 'rank_item1'}>{item.rank}</div>
                                                <div className={(idx + 1) === user_rank ? 'rank_item_first' : 'rank_item2'}>{item.nickname}</div>
                                                <div className={(idx + 1) === user_rank ? 'rank_item_first' : 'rank_item3'}>{item.collection_rate}</div>
                                                <div className={(idx + 1) === user_rank ? 'rank_item_first' : 'rank_item4'}>{item.pronunce_acc_rate}</div>
                                            </>
                                        )
                                    })

                                    : null
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default Dashboard;
