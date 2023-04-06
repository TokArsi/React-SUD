import React, {useState, useRef, useEffect} from "react";
import './formgenerator.scss';
import FormTitle from './FormTitle/FormTitle'
import FormButton from './FormButton/FomrButton'
import FormControl from './FormControl/FormControl'
import Input from "../Input/Input";

const FormGenerator = ({formData, formActive}) => {
    const form = useRef(null);
    useEffect(()=>{
        if(!formActive)
        {
            form.current.reset();
        }
    })
    return (
        <form id={formData.title} ref={form} onSubmit={(e) => {
            e.preventDefault();
            formData.OnSubmit(e);
        }}>
            <FormTitle title={formData.title}/>
            <Input inputAttributes={formData.inputAttributes}/>
            <FormButton formButtons={formData.formButtons}/>
        </form>
    )
}

export default FormGenerator;