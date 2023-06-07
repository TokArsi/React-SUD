import React from "react";
import './datalist.scss'

const SelectGenerator = ({dataList, id, name, setInputValuesState, value}) => {
    return (
        <select
            id={id}
            name={name}
            defaultValue={value ? value : ''}
            onChange={(e) => setInputValuesState(e)}>
            {value ? null : <option value="">Select an option</option>}
            {dataList.map((option, index) => (
                <option key={index}>{option}</option>
            ))}
        </select>
    )
}
export default SelectGenerator;