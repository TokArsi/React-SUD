import React, {useContext, useEffect, useLayoutEffect, useState} from "react";
import FormGenerator from "../ReusableForm/FormGenerator";
import {useNavigate, useParams} from "react-router-dom";
import DataContext from "../../contexts/DataContext";
const FormPage = () => {
    const [formData, setFormData] = useState(null);
    const [formGeneratorData, setFormGeneratorData] = useState(null);
    const [isDataDownload, setIsDataDownload] = useState(false);
    const navigate = useNavigate();
    const {createNewData, updateDataWithLogo} = useContext(DataContext);

    const formElementsUpdateNewPage =
        {
            type: 'Update',
            title: 'Update Role',
            Inputs: [
                {
                    name: 'Logo',
                    value: `${formData ? formData.Logo : 'Loading ...'}`,
                    type: 'file',
                    placeholder: '',
                    className: '',
                    OnChange: () => console.log('update')
                },
                {
                    name: 'Company',
                    value: `${formData ? formData.Company : 'Loading ...'}`,
                    type: 'text',
                    placeholder: '',
                    className: '',
                    OnChange: () => console.log('update')
                },
                {
                    name: 'Position',
                    value: `${formData ? formData.Position : 'Loading ...'}`,
                    type: 'text',
                    placeholder: '',
                    className: '',
                    dataList: ['Visual Designer', 'Product Designer', 'Interactive Designer', 'UI/UX Designer'],
                    OnChange: () => console.log('update')
                },
                {
                    name: 'Duration',
                    value: `${formData ? formData.Duration : 'Loading ...'}`,
                    type: 'text',
                    placeholder: '',
                    className: '',
                    dataList: ['Full-time', '12-months'],
                    OnChange: () => console.log('update')
                },
                {
                    name: 'Job_ID',
                    value: `${formData ? formData.Job_ID : 'Loading ...'}`,
                    type: 'text',
                    placeholder: '',
                    className: '',
                    OnChange: () => console.log('create')
                },
                {
                    name: 'Status',
                    value: `${formData ? formData.Status : 'Loading ...'}`,
                    type: 'text',
                    placeholder: '',
                    className: '',
                    dataList: ['Applied', 'Phone Interview', 'Round 2 Interview', 'Zoom Call'],
                    OnChange: () => console.log('update')
                }
            ],
            formButtons: [
                {
                    type: 'submit',
                    name: 'Update',
                    className: '',
                    OnClick: () => {}
                },
                {
                    type: 'reset',
                    name: 'Reset',
                    className: '',
                    OnClick: () => {}
                },
            ],
            OnSubmit: (e, values) => {
                updateDataWithLogo(e, values);
                navigate('/');
            }
        }
    const formElementsCreateNewPage =
        {
            type: 'Create',
            title: 'NEW ROLE',
            Inputs: [
                {
                    name: 'Logo',
                    value: ``,
                    type: 'file',
                    placeholder: '',
                    className: '',
                    OnChange: () => console.log('create')
                },
                {
                    name: 'Company',
                    value: ``,
                    type: 'text',
                    placeholder: '',
                    className: '',
                    OnChange: () => console.log('create')
                },
                {
                    name: 'Position',
                    value: ``,
                    type: 'text',
                    placeholder: '',
                    className: '',
                    dataList: ['Visual Designer', 'Product Designer', 'Interactive Designer', 'UI/UX Designer'],
                    OnChange: () => console.log('create')
                },
                {
                    name: 'Duration',
                    value: ``,
                    type: 'text',
                    placeholder: '',
                    className: '',
                    dataList: ['Full-time', '12-months'],
                    OnChange: () => console.log('create')
                },
                {
                    name: 'Job_ID',
                    value: ``,
                    type: 'text',
                    placeholder: '',
                    className: '',
                    OnChange: () => console.log('create')
                },
                {
                    name: 'Status',
                    value: ``,
                    type: 'text',
                    placeholder: '',
                    className: '',
                    dataList: ['Applied', 'Phone Interview', 'Round 2 Interview', 'Zoom Call'],
                    OnChange: () => console.log('create')
                }
            ],
            formButtons: [
                {
                    type: 'submit',
                    name: 'Create',
                    className: '',
                    OnClick: null
                },
                {
                    type: 'reset',
                    name: 'Reset',
                    className: '',
                    OnClick: null
                },
                {
                    type: 'button',
                    name: 'Close',
                    className: '',
                    OnClick: () => {
                    }
                }
            ],
            OnSubmit: (e, values) => {
                createNewData(e, values);
                navigate('/');
            }
        }
    const {id} = useParams();
    console.log('formData', formData)
    console.log('formGeneratorData: ', formGeneratorData)
    const fetchData = async (id) => {
        if(id !== 'create' && id && id !== 'authorization' && id !=='registration')
        {
            const response = await fetch('http://localhost:3002/form/id', {
                mode: 'cors',
                method: 'POST',
                headers: new Headers({'content-type': 'application/json'}),
                body: JSON.stringify({id})
            })
                .then((data) => data.json())
                .then(data => {
                    setIsDataDownload(true);
                    setFormData(data);
                })
        } else setFormGeneratorData(formElementsCreateNewPage);
    }

    useEffect(() => {
            fetchData(id);
    }, [])
    useEffect(() => {
        if(isDataDownload)
            setFormGeneratorData(formElementsUpdateNewPage);
    }, [isDataDownload]);


    return (
        <div className={`form-page-wrapper`}>
            {formGeneratorData
                ? <FormGenerator formData={formGeneratorData} formActive={true}/>
                : <div>Loading ...</div>}
        </div>
    )
}
export default FormPage;