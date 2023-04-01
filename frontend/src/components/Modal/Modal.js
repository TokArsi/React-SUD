import React, {useState,useEffect} from "react";
import ReactDOM from 'react-dom';
import './modal.scss'

export const Modal = ({keeper, setKeeper, active, setActive, children}) => {
    const [inputValue, setInputValue] = useState({})
    const modalRoot = document.getElementById('modal-root');
    const [el] = useState(document.createElement('div'));
    useEffect(() => {
        modalRoot.appendChild(el);
        return () => {
            modalRoot.removeChild(el);
        };
    },[el, modalRoot])
    return ReactDOM.createPortal(
        <div className = {active? "modal active" : "modal"} onClick={() => setActive(false)}>
            <div className={active? "modal__content active" : "modal__content"} onClick={(e) => e.stopPropagation()}>
                <div className="container">
                    <div className="closeBox">
                        <div className="cancel-button" onClick={() => {setActive(false);}}>
                            <img src="/img/closebox.png" alt=""/>
                        </div>
                    </div>
                    <div className="content">
                        {children}
                    </div>
                </div>
            </div>
        </div>, el);
};