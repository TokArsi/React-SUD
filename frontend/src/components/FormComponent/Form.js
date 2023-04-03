import React, {useState, useRef, useEffect} from "react";
import './form.scss'


const Form = ({data, setData, modalActiveForSave, setModalActiveForSave, keeper, setModalActiveForUpdate, modalActiveForUpdate}) => {
    const [inputValues, setInputValues] = useState({});
    const [isVisible, setIsVisible] = useState(false)
    const form = useRef(null);
    const input = useRef(null);
    const [hasData, setHasData] = useState(false);
    const [isFileDownloaded, setIsFileDownloaded] = useState({
        status: false,
        url : ''
    });
    let arrayOfInputsValue = {};

    useEffect(()=>{
        if (modalActiveForSave === true)
            setHasData(false);
        else form.current.reset();
        if(modalActiveForUpdate === true)
            setHasData(true);
        else
        {
            setHasData(false);
            form.current.reset();
            setIsVisible(false);
        }
        if (isFileDownloaded.status)
        {
            console.log('Файл загружен')
        }
    }, [modalActiveForSave, modalActiveForUpdate, isFileDownloaded])




    const isValidForm = (e, arrayOfValidInputs) => {
        const name = e.target.name;
        // const temp = Object.assign(arrayOfValidInputs.field);
        if (e.target.value === '') {
            e.target.classList.add('error')
            // temp.field[name] = false;
            // setArrayOfValidInputs({...temp, status: false})
        } else
            e.target.classList.remove('error');
        //     temp.field[name]= true;
        //     setArrayOfValidInputs({...temp, status: false})
        // }
        // if(Object.values(arrayOfValidInputs.field).every((val) => val === true))
        //     setArrayOfValidInputs((prevState) => {
        //         return {...prevState.field, status: true}
        //     })
    }

    const makeArrayOfInputs = (id, v) => {
        arrayOfInputsValue = inputValues;
        if (Object.keys(arrayOfInputsValue).length > 0)
            for (let i in arrayOfInputsValue) {
                if (i === id) {
                    arrayOfInputsValue[id] = v;
                } else Object.defineProperty(arrayOfInputsValue, id, {value: v, enumerable: true, writable: true});
            }
        else Object.defineProperty(arrayOfInputsValue, id, {value: v, enumerable: true, writable: true});
        console.log(arrayOfInputsValue);
        setInputValues(arrayOfInputsValue);
    }

    const handleInputChange = (e) => {
        const datalist = document.getElementById(`${e.target.list.id}`);
        const options = Array.from(datalist.options).map(o => o.value);
        if (!Array.from(options).includes(e.target.value)) {
            e.target.value = '';
        }
    };

    const fetchToUpdate = (copy, data) => {
        fetch('http://localhost:3002/request-update', {
            method: "PUT",
            headers: new Headers({'content-type': 'application/json', 'boundary': 'something'}),
            body: JSON.stringify(copy)
        })
            .then((res) => res.json())
            .then((result) => {
                const index = data.findIndex(item => item._id === result._id);
                const newData = [...data]
                newData[index] = result;
                setData(newData);
                setModalActiveForUpdate(false)
                if(!modalActiveForUpdate)
                    form.current.reset();
            })
    }

    const requestToServerForUpdate = (inputValues, keeper, isVisible) => {
        console.log(inputValues)
        const id = document.getElementById("form-to-update");
        const file = document.getElementById('Logo')
        console.log('file', file)
        const copy = {};
        Object.assign(copy, keeper)
        for (let i in copy) {
            for (let j in inputValues) {
                if (j === i)
                    copy[i] = inputValues[j];
            }
        }
        console.log('copy: ', copy)
        if (isVisible) {
            if (file.files[0]) {
                const formData = new FormData(id);
                console.log('image: ', formData.get("Logo"));
                fetch('http://localhost:3002/images', {
                    method: 'POST',
                    body: formData
                })
                    .then((res) => res.json())
                    .then((result) => {
                        copy.Logo = result;
                        return copy;
                    })
                    .then((copy) => {
                        fetchToUpdate(copy, data);
                    })
            } else (alert('Выберите файл, чтобы изменить данные'))
        } else {
            fetchToUpdate(copy, data);
        }
    }

    const requestToServerForInsert = (inputValues) => {
        console.log(inputValues)
        const id = document.getElementById("form-to-save");
        const formData = new FormData(id);
        console.log(formData.get("Logo"))
        fetch('http://localhost:3002/images', {
            mode: 'cors',
            method: 'POST',
            body: formData
        })
            .then((res) => res.json()
                .then((response) => {
                    inputValues.Logo = response;
                    console.log(inputValues)
                }))
            .then(() => {
                    fetch('http://localhost:3002/post-request', {
                        mode: 'cors',
                        method: 'POST',
                        headers: new Headers({'content-type': 'application/json', 'boundary': 'something'}),
                        body: JSON.stringify(inputValues)
                    })
                        .then(res => res.json())
                        .then((result) => setData(prevState => [...prevState, result]))
                        .then(() => {
                            setModalActiveForSave(false);
                            if(!modalActiveForSave)
                                form.current.reset();
                        })
                        .catch((error) => console.log(error))
                }
            )

    }

    const afterOnSubmit = (hasData, e) => {
        e.preventDefault();
        if(hasData) {
            requestToServerForUpdate(inputValues, keeper, isVisible);
            setModalActiveForUpdate(false);
            setIsVisible(false);
            form.current.reset();
        }
        else {
            requestToServerForInsert(inputValues);
            setModalActiveForSave(false);
            form.current.reset();
        }
    }

    const showLogo = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setIsFileDownloaded({status: true, url: reader.result});
        }
        reader.readAsDataURL(file);
    }

    return (
        <form className="form" ref = {form}
              id = {hasData
                  ? "form-to-update"
                  : "form-to-save"}
              onSubmit={(e) => afterOnSubmit(hasData, e)}
        >
            <div className="form-group-wrapper">
                {Object.keys(Object(data[0])).map((item, index) =>
                {
                    if (item!=='_id' && !hasData)
                        return (
                            <div key={index} className="form-group">
                                <label htmlFor={item}>{item}</label>
                                <input type={item === 'Logo'
                                    ? 'file'
                                    : 'text'}
                                       name = {item}
                                       className={item === 'Logo'
                                           ? "form-field-logo"
                                           : "form-field"}
                                       ref  = {item === 'Logo'
                                           ? input
                                           : null}
                                       onChange={(e) => {
                                           makeArrayOfInputs(e.target.name, e.target.value);
                                           isValidForm(e);
                                           if (item === 'Logo') {
                                           }
                                           }}
                                />
                            </div>
                        )
                    else
                    if (hasData === true && item!=='_id')
                        return (
                            <div key={index} className="form-group">
                                <label htmlFor={item}>{item}</label>
                                <input id={item=== 'Logo'
                                    ? item
                                    : null}
                                       type={item === 'Logo'
                                           ? 'file'
                                           : 'text'}
                                       defaultValue={keeper[item]}
                                       name = {item}
                                       className={item === 'Logo'
                                           ? "form-field-logo"
                                           : "form-field"}
                                       hidden = {item === 'Logo'
                                           ? !isVisible
                                           : null
                                       }
                                       ref  = {item === 'Logo'
                                           ? input
                                           : null}
                                       onChange={(e) => {
                                           makeArrayOfInputs(e.target.name, e.target.value);
                                           isValidForm(e);
                                       }}
                                />
                            </div>
                        )
                })}
                <button type="submit">Submit</button>
                {hasData &&
                    <button
                    type="button"
                    onClick={() => setIsVisible(true)}
                    >Change logo</button>}
                <button type="button"
                        onClick={() => {
                            if(hasData === true) {
                                setModalActiveForUpdate(false);
                            }
                            else {
                                setModalActiveForSave(false);
                            }
                        }}>Close</button>
            </div>
            <div className="form-logo">
                {isFileDownloaded.status && <img src={isFileDownloaded.url} alt=""/>}
            </div>
        </form>
    );
            }
export default Form;
