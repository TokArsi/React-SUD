import React, {useContext, useEffect} from "react";
import './home.scss'
import Top from "../TopComponent/Top";
import StatusBoard from "../StatusBoard/StatusBoard";
import InterviewComponent from "../InterviewComponent/InterviewComponent";
import Roles from "../RoleComponent/Roles";
import {useNavigate} from "react-router-dom";


const Home = () => {
    return (
        <div className="wrapper">
            <div className="left-side">
                <Top/>
                <StatusBoard/>
            </div>
            <div className="right-side">
                <InterviewComponent/>
                <Roles/>
            </div>
        </div>
    )
}
export default Home;