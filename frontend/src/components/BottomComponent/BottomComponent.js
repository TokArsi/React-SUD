import React, {useState, useEffect} from 'react';
import './BottomComponent.scss';
import Roles from "../RoleComponent/Roles";
import StatusBoard from "../StatusBoard/StatusBoard";


const BottomComponent = (props) => {


    const title = "Roles";
    const DataOfRoles = [
        {
            number: 6,
            title: 'Visual Designer'
        },
        {
            number: 4,
            title: 'Product Designer'
        },
        {
            number: 6,
            title: 'Interactive Designer'
        },
        {
            number: 2,
            title: 'UX/ UI Designer'
        },
    ];
    const titleOfStatusBoard = "Status Board";
    const DataOFTools = [
        "filter-option.png",
        "pencil-edit.png",
        "share-option.png",
        "search-option.png",
        "delete-option.png",
    ]
    return (
    <div className="main-block">
        <StatusBoard/>
        <Roles title = {title} data = {DataOfRoles}/>
    </div>
    );
}