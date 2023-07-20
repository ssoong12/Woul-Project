import { useEffect, useState } from 'react'
import './../css/Modal.css'

/**
 * 
 * @param {*} props .width, .height : {int} Modal 창 크기 // .element : {jdx} 모달 창 내부 컨텐츠 //
 * .fade : {boolean} 모달창 띄움, 띄우지 않음
 * @returns 
 */
function Modal(props){

    let [ fade, setFade ] = useState('')

    useEffect(() => {
        if (props.fade == true) {
            setFade('popUp')
        }
    }, [])
    

    return (
        <div className={'modalBackGround ' + fade}>
            <div className={'backModal'} style={{
              width: props.width, height: props.height
              }}>
              
              <div className='subModal'>
              {/* 부모 컴포넌트에서 전달받은 element */}
              { props.element }
              
              </div>
            </div>
            </div>
    )
}

export default Modal