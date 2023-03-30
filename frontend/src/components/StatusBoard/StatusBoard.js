import React, {useState, useEffect, useRef} from 'react'
import './statusboard.scss'
import {Modal} from "../Modal/Modal";
import {logDOM} from "@testing-library/react";


const deletedItems = (data, checkedCheckBoxes) => data.filter((item) => !checkedCheckBoxes.includes(item._id))
const StatusBoard = () => {
    const [data, setData] = useState([]);
    const [modalActiveForSave, setModalActiveForSave] = useState(false);
    const [modalActiveForUpdate, setModalActiveForUpdate] = useState(false);
    const [inputValues, setInputValues] = useState({});
    const [keeper, setKeeper] = useState({})
    const [checkedCheckBoxes, setCheckedCheckBoxes] = useState([])
    const [isVisible, setIsVisible] = useState(false)
    const [arrayOfValidInputs, setArrayOfValidInputs] = useState({
        status: false,
        field : {
            img_link: false,
            company: false,
            position: false,
            duration: false,
            job_id: false,
            status: false
        }
    })
    const [inputValue, setInputValue] = useState();
    console.log(arrayOfValidInputs)

    let arrayOfInputsValue = {};
    useEffect(() => {
        fetch("http://localhost:3002/board-data")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                return data;
            })
            .then((data) => setData(data))
    }, [])

    const dataForUpdate = (id, keeper, data) => {
        data.map((item) => {
                if (item._id === id) {
                    setKeeper(item)
                }
            }
        )
    }
    const requestToServerForDelete = (checkedCheckBoxes) => {
        if(checkedCheckBoxes.length !== 0)
            fetch('http://localhost:3002/request-delete', {
                method: "DELETE",
                headers: new Headers({'content-type': 'application/json', 'boundary': 'something'}),
                body: JSON.stringify(checkedCheckBoxes)
            })
                .then((res) => {
                        const result = deletedItems(data, checkedCheckBoxes);
                        setData(result);
                        data.map((item) => {
                            const p = document.getElementById(item._id);
                            p.checked = false;
                        })
                })
                .catch(error => alert(`Can not delete.\n Error description: ${error}`))

        else console.log("Id's array is empty!!!");

    }
    const CheckboxChecked = (checked, id) => {
        const temp = checkedCheckBoxes;
        let count = 0;
        if (checked===false)
        {
            temp.map((i, index) => {
                if(i === id)
                    temp.splice(index, 1)
            })
        }
        else {
            temp.map((i) => {
                if(i ===id)
                    count++;
            })
            if(count===0)
            {
                temp.push(id);
            }
        }
        console.log(temp)
        setCheckedCheckBoxes(temp)
    }
    const isValidForm = (e, arrayOfValidInputs) => {
        const name = e.target.name;
        // const temp = Object.assign(arrayOfValidInputs.field);
            if (e.target.value === '')
            {
                e.target.classList.add("error")
                // temp.field[name] = false;
                // setArrayOfValidInputs({...temp, status: false})
            }
            else
                e.target.classList.remove('error');
            //     temp.field[name]= true;
            //     setArrayOfValidInputs({...temp, status: false})
            // }
            // if(Object.values(arrayOfValidInputs.field).every((val) => val === true))
            //     setArrayOfValidInputs((prevState) => {
            //         return {...prevState.field, status: true}
            //     })
    }
    const handleInputChange = (e) => {
        const datalist  = document.getElementById(`${e.target.list.id}`);
        const options = Array.from(datalist.options).map(o => o.value);
        if(!Array.from(options).includes(e.target.value))
        {
            e.target.value = '';
        }
    };

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
    const fetchToUpdate = (copy, data) => {
        fetch('http://localhost:3002/request-update',{
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
                setIsVisible(false)
                setModalActiveForUpdate(false)
            })
    }
    const requestToDeleteOldLogo = (data) => {
        fetch('http://localhost:3002/request-delete-logo', {
            method: "DELETE",
            headers: new Headers({'content-type': 'application/json', 'boundary': 'something'}),
            body: JSON.stringify(data)
        })

    }
    const requestToServerForUpdate = (inputValues, keeper, isVisible) => {
        console.log(inputValues)
        const id = document.getElementById("form");
        const file = document.getElementById('img_link');
        console.log('file',file)
        const copy = {};
        Object.assign(copy, keeper)
        for (let i in copy){
            for (let j in inputValues){
                if(j === i)
                   copy[i] = inputValues[j];
            }
        }
        console.log('copy: ', copy)
        if (isVisible){
            if(file.files[0])
            {
                const formData = new FormData(id);
                console.log('image: ', formData.get("img_link"));
                fetch('http://localhost:3002/images', {
                    method: 'POST',
                    body: formData
                })
                    .then((res) => res.json())
                    .then((result) => {
                        copy.img_link = result;
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
        const id = document.getElementById("form-to-request");
        const formData = new FormData(id);
        console.log(formData.get("img_link"))
        fetch('http://localhost:3002/images', {
            mode: 'cors',
            method: 'POST',
            body: formData
        })
            .then((res) => res.json()
                .then((response) => inputValues.img_link = response))
            .then(() => {
                    fetch('http://localhost:3002/post-request', {
                        mode: 'cors',
                        method: 'POST',
                        headers: new Headers({'content-type': 'application/json', 'boundary': 'something'}),
                        body: JSON.stringify(inputValues)
                    })
                        .then(res => res.json())
                        .then((result) => setData(prevState => [...prevState, result]))
                        .then(() => id.reset())
                        .catch((error) => console.log(error))
            }
            )

    }
    return (
        <div className="status-board">
            <div className="status-board-tools">
                <div className="title">Status Board</div>
                <div className="tools">
                    <div className="tool">
                        <img src="/img/filter-option.png" alt="lol"/>
                    </div>
                    <div className="tool">
                        <img src="/img/pencil-edit.png" alt="lol"/>
                    </div>
                    <div className="tool">
                        <img src="/img/share-option.png" alt="lol"/>
                    </div>
                    <div className="tool">
                        <img src="/img/search-option.png" alt="lol"/>
                    </div>
                    <div id = "delete-option" className="tool" onClick={() => {
                        const isConfirmed = window.confirm('Are you sure about deleting data?');
                        if(isConfirmed)
                        requestToServerForDelete(checkedCheckBoxes);
                    }}>
                        <img src="/img/delete-option.png" alt="lol"/>
                    </div>
                </div>
            </div>
            <div className="table">
                <div className="table-columns">
                    <table>
                        <thead>
                        <tr>
                            <th></th>
                            <th></th>
                                <th className="column-name">Company</th>
                                <th className="column-name">Position</th>
                                <th className="column-name">Duration</th>
                                <th className="column-name">Job_ID#</th>
                                <th className="column-name">Status</th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                                {data.map(({company, position, duration, job_id, status, _id, img_link},index) => (
                                          <tr key={index}>
                                              <td className="td-data">
                                                  <div className="checkbox">
                                                      <input id = {_id} type="checkbox" onChange={(e) => CheckboxChecked(e.currentTarget.checked, e.currentTarget.id)}/>
                                                  </div>
                                              </td>
                                             <td className="td-data logo">
                                                    <div className="border-box">
                                                         <img className="ellipse" src="/img/ellipse.png" alt=""/>
                                                        <img className="picture" src={img_link} alt=""/>
                                                    </div>
                                             </td>
                                              <td className="td-data">
                                                  <div className="table-data">{company}</div>
                                              </td>
                                              <td className="td-data">
                                                  <div className="table-data">{position}</div>
                                              </td>
                                              <td className="td-data">
                                                  <div className="table-data">{duration}</div>
                                              </td>
                                              <td className="td-data">
                                                  <div className="table-data">{job_id}</div>
                                              </td>
                                              <td className="td-data">
                                                  <div className="table-data">{status}</div>
                                              </td>
                                              <td className="td-data tool-editor">
                                                  <div className="tool-bar">
                                                      <div className="editor">
                                                          <img onClick={() => {dataForUpdate(_id, keeper, data);  setModalActiveForUpdate(true)}} src="/img/pencil-edit.png" alt=""/>
                                                      </div>
                                                  </div>
                                              </td>
                                              <td className="td-data tool-deleter">
                                                  <div className="deleter">
                                                      <img onClick={() => {const isConfirmed = window.confirm('Are you sure about deleting this data?'); if(isConfirmed){requestToServerForDelete([_id])}}} src="/img/delete-option.png" alt=""/>
                                                  </div>
                                              </td>
                                          </tr>
                                       ))}
                        </tbody>
                    </table>

                </div>
            </div>
            <button onClick={() => setModalActiveForSave(true)}>Add new data</button>
            <Modal active={modalActiveForSave} setActive={setModalActiveForSave}>
                <div className="container">
                    <div className="closeBox">
                        <div className="cancel-button" onClick={() => {setModalActiveForSave(false);}}>
                            <img src="/img/closebox.png" alt=""/>
                        </div>
                    </div>
                    <div className="content">
                        <form id="form-to-request">
                            <div className="inputs">
                                <label htmlFor="img_link">Logo</label>
                                <input name = "img_link" type="file" onBlur={(e) => isValidForm(e, arrayOfValidInputs)} onChange={(e) => {makeArrayOfInputs(e.target.name, e.target.value);}}/>
                            </div>
                            <div className="inputs">
                                <label htmlFor="company">Company</label>
                                <input autoComplete="off" name = "company" type="text" onBlur={(e) => isValidForm(e, arrayOfValidInputs)} onChange={(e) => {makeArrayOfInputs(e.target.name, e.target.value);}}/>
                            </div>
                            <div className="inputs">
                                <label htmlFor="position">Position</label>
                                <input autoComplete="off" name = "position" list = "autocomplete-list-position" type="text" onBlur={(e) => isValidForm(e, arrayOfValidInputs)} onChange={(e) => {makeArrayOfInputs(e.target.name, e.target.value); handleInputChange(e)}}/>
                                <datalist id="autocomplete-list-position">
                                    <option value="UX/ UI Designer" />
                                    <option value="12-Visual Designer" />
                                    <option value="Product Designer" />
                                    <option value="Interactive Designer" />
                                </datalist>
                            </div>
                            <div className="inputs">
                                <label htmlFor="duration">Duration</label>
                                <input autoComplete="off" name = "duration" list="autocomplete-list-duration" type="text" onBlur={(e) => isValidForm(e, arrayOfValidInputs)} onChange={(e) => {handleInputChange(e); makeArrayOfInputs(e.target.name, e.target.value);}}/>
                                <datalist id="autocomplete-list-duration">
                                    <option value="Full time" />
                                    <option value="12-months" />
                                </datalist>
                            </div>
                            <div className="inputs">
                                <label htmlFor="job_id">Job_id#</label>
                                <input autoComplete="off" name = "job_id" type="text" onBlur={(e) => isValidForm(e)} onChange={(e) => {makeArrayOfInputs(e.target.name, e.target.value);}}/>
                            </div>
                            <div className="inputs">
                                <label htmlFor="status">Status</label>
                                <input  autoComplete="off" name = "status" type="text" list = "autocomplete-list-status" onBlur={(e) => isValidForm(e)} onChange={(e) => {handleInputChange(e); makeArrayOfInputs(e.target.name, e.target.value);}}/>
                                <datalist id="autocomplete-list-status">
                                    <option value="Applied" />
                                    <option value="Zoom Call" />
                                    <option value="Round 2 Interview" />
                                    <option value="Phone Interview" />
                                    <option value="Round 1 Interview" />
                                </datalist>
                            </div>
                        </form>

                        <div className="buttons">
                            {arrayOfValidInputs.status && <div className="button">
                                <button onClick={() => {
                                    requestToServerForInsert(inputValues);
                                }
                                }
                                >Submit</button></div>
                }
                            <div className="button"><button onClick={() => {
                                setModalActiveForSave(false);
                                const id = document.getElementById('form-to-request');
                                id.reset();
                            }}>Cancel</button></div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal isVisible = {isVisible} setIsVisible = {setIsVisible} keeper = {keeper} setKeeper={setKeeper} active={modalActiveForUpdate} setActive={setModalActiveForUpdate}>
                <div className="container">
                    <div className="closeBox">
                        <div className="cancel-button" onClick={() => {
                            setModalActiveForUpdate(false);
                            const id = document.getElementById('form');
                            id.reset();setIsVisible(false)}}>
                            <img src="/img/closebox.png" alt=""/>
                        </div>
                    </div>
                    <div className="content">
                        <form id="form">
                            <div className="inputs">
                                <label htmlFor="img_link">Logo</label>
                                <img width={30} height={30} src={keeper.img_link} alt=""/>
                                {isVisible && <input id = "img_link" name = "img_link" type="file" onChange={(e) => makeArrayOfInputs(e.target.name, e.target.files[0].name)}/>}
                            </div>
                            <div className="inputs">
                                <label htmlFor="company">Company</label>
                                <input placeholder={keeper.company} name = "company" type="text" onChange={(e) =>{ makeArrayOfInputs(e.target.name, e.target.value)}}/>
                            </div>
                            <div className="inputs">
                                <label htmlFor="position">Position</label>
                                <input placeholder={keeper.position} name = "position" type="text" onChange={(e) => makeArrayOfInputs(e.target.name, e.target.value)}/>
                            </div>
                            <div className="inputs">
                                <label htmlFor="duration">Duration</label>
                                <input placeholder={keeper.duration} name = "duration" list="autocomplete-list-update" type="text" onChange={(e) => {handleInputChange(e); makeArrayOfInputs(e.target.name, e.target.value);}}/>
                                <datalist id="autocomplete-list-update">
                                    <option value="Full time" />
                                    <option value="12-months" />
                                </datalist>
                            </div>
                            <div className="inputs">
                                <label htmlFor="job_id">Job_id#</label>
                                <input placeholder={keeper.job_id} name = "job_id" type="text" onChange={(e) => makeArrayOfInputs(e.target.name, e.target.value)}/>
                            </div>
                            <div className="inputs">
                                <label htmlFor="status">Status</label>
                                <input placeholder={keeper.status} name = "status" type="text" onChange={(e) => makeArrayOfInputs(e.target.name, e.target.value)}/>
                            </div>
                        </form>

                        <div className="buttons">
                            <div className="button">
                                <button onClick={() => {
                                    requestToServerForUpdate(inputValues, keeper, isVisible);
                                }
                                }
                                >Submit</button></div>
                            <div className="button"><button onClick={() => {
                                setModalActiveForUpdate(false);
                                const id = document.getElementById('form');
                                id.reset();
                                setIsVisible(false)}}>Cancel</button></div>
                            <div className="button"><button onClick={() => setIsVisible(true)}>Изменить картинку</button></div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
export default StatusBoard;