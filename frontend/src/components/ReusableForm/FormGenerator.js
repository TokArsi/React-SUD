import React, {useState, useRef, useEffect} from "react";

import './formgenerator.scss';
import FormTitle from './FormTitle/FormTitle'
import FormButton from './FormButton/FomrButton'
import Input from "../Input/Input";
import SelectGenerator from "./SelectGenerator/SelectGenerator";

const FormGenerator = ({formData: formData, formActive}) => {
    const form = useRef(null);
    const [inputValues, setInputValues] = useState({});
    console.log(inputValues)
    const setInputValuesState = (e) => {
        setInputValues(prevState => {
            return {
                ...prevState,
                [e.target.name]: e.target.value
            }
        })
    }

    useEffect(()=>{
        if(!formActive)
        {
            form.current.reset();
        }
    })
    return (
        <form id={formData.title}
              ref={form}
              className={'form'}
              onSubmit={(e) => {
                e.preventDefault();
                formData.OnSubmit(e, inputValues);
        }}>
            <FormTitle title={formData.title}/>
            {formData.Inputs.map((input, index) => (
                <div key={index} className={'form-input-group'}>
                    <label htmlFor={input.name}>{input.name}</label>
                    {input.dataList
                        ? <SelectGenerator
                            id={`form-select-${input.name}`}
                            name={input.name}
                            dataList={input.dataList}
                            value={input.value}
                            setInputValuesState={setInputValuesState}/>
                        :<Input
                        id={input.name}
                        name={input.name}
                        type={input.type}
                        value={input.value}
                        placeholder={input.placeholder}
                        className={input.className}
                        onChange={input.OnChange}
                        setInputValuesState={setInputValuesState}
                    />
                    }
                </div>
            ))}
            <div className="form-button-group">
            {formData.formButtons.map((button, index) => (

                    <FormButton
                        key={index}
                        className={button.className}
                        type={button.type}
                        onClick={button.OnClick}
                        title={button.name}
                    />
            ))}
            </div>
        </form>
    )
}

export default FormGenerator;