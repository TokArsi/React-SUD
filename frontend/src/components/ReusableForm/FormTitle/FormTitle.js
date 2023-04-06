import React from "react";
import {findAllByDisplayValue} from "@testing-library/react";

const FormTitle = ({title}) => {
    return (
        <div>
            <h3>{title}</h3>
        </div>
    )
}
export default FormTitle;