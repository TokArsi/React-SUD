import React, {useState, useRef, useEffect} from "react";
import './input.scss';


const Input = ({inputAttributes}) => {
    return (
        <div>
            {inputAttributes.names.map((item, index) => (
                <div key={index}>
                    <label htmlFor={item}>{item}</label>
                    <input
                        id={inputAttributes.defaultValue
                            ? item
                            : ''}
                        name={item}
                        defaultValue={inputAttributes.defaultValue[index]}
                        type={inputAttributes.types[index]}
                        placeholder={inputAttributes.placeholders!==undefined
                            ? inputAttributes.placeholders[index]
                            : ''}
                        onChange={(e) => inputAttributes.OnChange.map(func => func(e))}
                    />
                </div>
                ))
            }
        </div>
    )

}

export default Input;