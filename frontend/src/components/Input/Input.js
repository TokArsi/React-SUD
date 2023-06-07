import React from "react";
import './input.scss';
import input from "./Input";


const Input = ({id, name, type, className, placeholder, onChange, value, setInputValuesState}) => {

    if(type==='file')
     return (
        <input
            type={type}
            id={id}
            name={name}
            className={className
                ?`form-input-file ${className}`
                :`form-input-file`}
            placeholder={placeholder}
            // onChange={(e) => {
            //     setInputValuesState(e);
            // }}
        />)
        else return (
        <input
            type={type}
            id={id}
            name={name}
            className={className
                ?`form-input ${className}`
                :`form-input`}
            placeholder={placeholder}
            autoComplete={`off`}
            onChange={(e) => {
                setInputValuesState(e);
            }}
            defaultValue={value
                ? value
                : ''}
        />
    )

}

export default Input;