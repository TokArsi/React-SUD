import React from "react";
import './interviewcomponent.scss'
const InterviewComponent = () => {
    return(
        <div className="interviewers">
            <div className="top-block-2">
                <div className="interviewers-block-1">
                    <div className="content-interviewers-block-1">Interviewers</div>
                </div>
                <div className="interviewers-block-2">
                    <div className="content-interviewers-block-2">See All</div>
                </div>
            </div>
            <div className="bottom-block-2">
                <div className="block-rectangle">
                    <div className="content-block">
                        <div className="content-block-rectangle-1">Arsen</div>
                        <div className="content-block-rectangle-2">Toktogonov</div>
                        <div className="content-block-rectangle-3"><a href="" target="_blank">GitHub: TokArsi</a></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default InterviewComponent;