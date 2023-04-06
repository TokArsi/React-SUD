import React, {useState} from "react";

const FormButton = ({formButtons}) => {
  return (
      <div>
          <div className="form-submit-button">
              <button type="submit">{formButtons.submitButtonName}</button>
          </div>
          {formButtons.buttons.map(((button, index) => {
              return (
                  <div key={index} >
                      <button type={button.type} onClick={button.OnClick}>{button.name}</button>
                  </div>
              )
          }))}
          <div className="form-reset-button">
              <button type="reset">{formButtons.resetButtonName}</button>
          </div>
      </div>
  )
}
export default FormButton;