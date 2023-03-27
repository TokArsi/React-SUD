import React from 'react';

import './top.scss'
const ARR = [
    {
        title: 'Contract Roles',
        number: '6'
    },
    {
        title: 'Full-Time Roles',
        number: '12'
    },
    {
        title: 'Total Applications',
        number: '18'
    },
]
const Top = () => {
    return (
        <div className="top-wrapper">
            <div className="application">
                <div className="top-block">
                    <div className="block-1">
                        <div className="content-block-1">Application statistics</div>
                    </div>
                    <div className="block-2">
                        <div className="content-block-2">See All</div>
                    </div>
                </div>
                <div className="bottom-block">
                    {
                        ARR.map(({title, number}, index) => (
                            <div key = {index} className="blocks">
                                <div className="rectangle">
                                    <div className="block-number">{number}</div>
                                    <div className="block-text">{title}</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            {/*<div className="interviewers">*/}
            {/*    <div className="top-block-2">*/}
            {/*        <div className="interviewers-block-1">*/}
            {/*            <div className="content-interviewers-block-1">Interviewers</div>*/}
            {/*        </div>*/}
            {/*        <div className="interviewers-block-2">*/}
            {/*            <div className="content-interviewers-block-2">See All</div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="bottom-block-2">*/}
            {/*        <div className="block-rectangle">*/}
            {/*            <div className="content-block">*/}
            {/*                <div className="content-block-rectangle-1">Figma | Product Designer</div>*/}
            {/*                <div className="content-block-rectangle-2">Interview | Chad Lee</div>*/}
            {/*                <div className="content-block-rectangle-3">May 4, 2020 @12:30 pm - 1:00 pm</div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}
export default Top;