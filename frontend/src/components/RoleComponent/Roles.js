import React from 'react'
import './roles.scss'
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

const Roles = () => {
    return (
        <div>
            <div className="title">Roles</div>
            {DataOfRoles.map(({number, title},index) => (
                <div key = {index} className="block-wrapper">
                        <div className="block-number">{number}</div>
                        <div className="block-title">{title}</div>
                </div>
                )
            )}
        </div>
    );
}
export default Roles;