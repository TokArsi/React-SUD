import './App.css';
import Top from "./components/TopComponent/Top";
import BottomComponent from "./components/BottomComponent/BottomComponent";
import React, {useEffect, useState} from 'react';
import StatusBoard from "./components/StatusBoard/StatusBoard";
import Roles from "./components/RoleComponent/Roles";
import InterviewComponent from "./components/InterviewComponent/InterviewComponent";

function App() {

    return (
    <div className="App">
      <header className="App-header">
      </header>
        <div className="container">
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
        </div>
    </div>
  );
}

export default App;
