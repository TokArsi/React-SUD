import React, {useState} from "react";

const FormButton = ({title, className, type, onClick }) => {
  return (
      <button
          type={type}
          className={className
              ? `form-button ${className}`
              : `form-button`}
      >{title}</button>
  )
}
export default FormButton;