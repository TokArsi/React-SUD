import React, {useState, useEffect} from 'react'
import './statusboard.scss'
import {Modal} from "../Modal/Modal";
import Form from "../FormComponent/Form.js";


const deletedItems = (data, checkedCheckBoxes) => data.filter((item) => !checkedCheckBoxes.includes(item._id))
const StatusBoard = () => {
    const [data, setData] = useState([]);
    const [modalActiveForSave, setModalActiveForSave] = useState(false);
    const [modalActiveForUpdate, setModalActiveForUpdate] = useState(false);
    const [keeper, setKeeper] = useState({})
    const [checkedCheckBoxes, setCheckedCheckBoxes] = useState([])


    useEffect(() => {
        fetch("http://localhost:3002/board-data")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                return data;
            })
            .then((data) => setData(data))
    }, [])


    const requestToServerForDelete = (checkedCheckBoxes) => {
        if (checkedCheckBoxes.length !== 0)
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
                        return item;
                    })
                })
                .catch(error => alert(`Can not delete.\n Error description: ${error}`))

        else console.log("Id's array is empty!!!");
    }

    const CheckboxChecked = (checked, id) => {
        const temp = checkedCheckBoxes;
        let count = 0;
        if (checked === false) {
            temp.map((i, index) => {
                if (i === id)
                    temp.splice(index, 1)
            })
        } else {
            temp.map((i) => {
                if (i === id)
                    count++;
            })
            if (count === 0) {
                temp.push(id);
            }
        }
        console.log(temp)
        setCheckedCheckBoxes(temp);
    }

    const requestToDeleteOldLogo = (data) => {
        fetch('http://localhost:3002/request-delete-logo', {
            method: "DELETE",
            headers: new Headers({'content-type': 'application/json', 'boundary': 'something'}),
            body: JSON.stringify(data)
        })
    }

    const dataForUpdate = (id, keeper, data) => {
        data.map((item) => {
                if (item._id === id) {
                    setKeeper(item)
                }
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
                    <div id="delete-option" className="tool" onClick={() => {
                        const isConfirmed = window.confirm('Are you sure about deleting data?');
                        if (isConfirmed)
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
                        {data.map(({Company, Position, Duration, Job_ID, Status, _id, Logo}, index) => (
                            <tr key={index}>
                                <td className="td-data">
                                    <div className="checkbox">
                                        <input id={_id} type="checkbox"
                                               onChange={(e) => CheckboxChecked(e.currentTarget.checked, e.currentTarget.id)}/>
                                    </div>
                                </td>
                                <td className="td-data logo">
                                    <div className="border-box">
                                        <img className="ellipse" src="/img/ellipse.png" alt=""/>
                                        <img className="picture" src={Logo} alt=""/>
                                    </div>
                                </td>
                                <td className="td-data">
                                    <div className="table-data">{Company}</div>
                                </td>
                                <td className="td-data">
                                    <div className="table-data">{Position}</div>
                                </td>
                                <td className="td-data">
                                    <div className="table-data">{Duration}</div>
                                </td>
                                <td className="td-data">
                                    <div className="table-data">{Job_ID}</div>
                                </td>
                                <td className="td-data">
                                    <div className="table-data">{Status}</div>
                                </td>
                                <td className="td-data tool-editor">
                                    <div className="tool-bar">
                                        <div className="editor">
                                            <img onClick={() => {
                                                dataForUpdate(_id, keeper, data);
                                                setModalActiveForUpdate(true)
                                            }} src="/img/pencil-edit.png" alt=""/>
                                        </div>
                                    </div>
                                </td>
                                <td className="td-data tool-deleter">
                                    <div className="deleter">
                                        <img onClick={() => {
                                            const isConfirmed = window.confirm('Are you sure about deleting this data?');
                                            if (isConfirmed) {
                                                requestToServerForDelete([_id])
                                            }
                                        }} src="/img/delete-option.png" alt=""/>
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
                <Form
                    data = {data}
                    setData = {setData}
                    modalActiveForSave = {modalActiveForSave}
                    setModalActiveForSave = {setModalActiveForSave}
                    keeper = {keeper}
                />
                {/*        <form id="form-to-request">*/}
                {/*            <div className="inputs">*/}
                {/*                <label htmlFor="img_link">Logo</label>*/}
                {/*                <input name = "img_link" type="file" onBlur={(e) => isValidForm(e, arrayOfValidInputs)} onChange={(e) => {makeArrayOfInputs(e.target.name, e.target.value);}}/>*/}
                {/*            </div>*/}
                {/*            <div className="inputs">*/}
                {/*                <label htmlFor="company">Company</label>*/}
                {/*                <input autoComplete="off" name = "company" type="text" onBlur={(e) => isValidForm(e, arrayOfValidInputs)} onChange={(e) => {makeArrayOfInputs(e.target.name, e.target.value);}}/>*/}
                {/*            </div>*/}
                {/*            <div className="inputs">*/}
                {/*                <label htmlFor="position">Position</label>*/}
                {/*                <input autoComplete="off" name = "position" list = "autocomplete-list-position" type="text" onBlur={(e) => isValidForm(e, arrayOfValidInputs)} onChange={(e) => {makeArrayOfInputs(e.target.name, e.target.value); handleInputChange(e)}}/>*/}
                {/*                <datalist id="autocomplete-list-position">*/}
                {/*                    <option value="UX/ UI Designer" />*/}
                {/*                    <option value="12-Visual Designer" />*/}
                {/*                    <option value="Product Designer" />*/}
                {/*                    <option value="Interactive Designer" />*/}
                {/*                </datalist>*/}
                {/*            </div>*/}
                {/*            <div className="inputs">*/}
                {/*                <label htmlFor="duration">Duration</label>*/}
                {/*                <input autoComplete="off" name = "duration" list="autocomplete-list-duration" type="text" onBlur={(e) => isValidForm(e, arrayOfValidInputs)} onChange={(e) => {handleInputChange(e); makeArrayOfInputs(e.target.name, e.target.value);}}/>*/}
                {/*                <datalist id="autocomplete-list-duration">*/}
                {/*                    <option value="Full time" />*/}
                {/*                    <option value="12-months" />*/}
                {/*                </datalist>*/}
                {/*            </div>*/}
                {/*            <div className="inputs">*/}
                {/*                <label htmlFor="job_id">Job_id#</label>*/}
                {/*                <input autoComplete="off" name = "job_id" type="text" onBlur={(e) => isValidForm(e)} onChange={(e) => {makeArrayOfInputs(e.target.name, e.target.value);}}/>*/}
                {/*            </div>*/}
                {/*            <div className="inputs">*/}
                {/*                <label htmlFor="status">Status</label>*/}
                {/*                <input  autoComplete="off" name = "status" type="text" list = "autocomplete-list-status" onBlur={(e) => isValidForm(e)} onChange={(e) => {handleInputChange(e); makeArrayOfInputs(e.target.name, e.target.value);}}/>*/}
                {/*                <datalist id="autocomplete-list-status">*/}
                {/*                    <option value="Applied" />*/}
                {/*                    <option value="Zoom Call" />*/}
                {/*                    <option value="Round 2 Interview" />*/}
                {/*                    <option value="Phone Interview" />*/}
                {/*                    <option value="Round 1 Interview" />*/}
                {/*                </datalist>*/}
                {/*            </div>*/}
                {/*        </form>*/}

                {/*        <div className="buttons">*/}
                {/*            {arrayOfValidInputs.status && <div className="button">*/}
                {/*                <button onClick={() => {*/}
                {/*                    requestToServerForInsert(inputValues);*/}
                {/*                }*/}
                {/*                }*/}
                {/*                >Submit</button></div>*/}
                {/*}*/}
                {/*            <div className="button"><button onClick={() => {*/}
                {/*                setModalActiveForSave(false);*/}
                {/*                const id = document.getElementById('form-to-request');*/}
                {/*                id.reset();*/}
                {/*            }}>Cancel</button></div>*/}
                {/*        </div>*/}
            </Modal>
            <Modal keeper={keeper} setKeeper={setKeeper} active={modalActiveForUpdate} setActive={setModalActiveForUpdate}>
                <Form
                    data = {data}
                    setData = {setData}
                    setModalActiveForUpdate= {setModalActiveForUpdate}
                    keeper = {keeper}
                    modalActiveForUpdate = {modalActiveForUpdate}
                />
                {/*<div className="container">*/}
                {/*        <div className="closeBox">*/}
                {/*            <div className="cancel-button" onClick={() => {*/}
                {/*                setModalActiveForUpdate(false);*/}
                {/*                const id = document.getElementById('form');*/}
                {/*                id.reset();setIsVisible(false)}}>*/}
                {/*                <img src="/img/closebox.png" alt=""/>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*        <div className="content">*/}
                {/*            <form id="form">*/}
                {/*                <div className="inputs">*/}
                {/*                    <label htmlFor="img_link">Logo</label>*/}
                {/*                    <img width={30} height={30} src={keeper.img_link} alt=""/>*/}
                {/*                    {isVisible && <input id = "img_link" name = "img_link" type="file" onChange={(e) => makeArrayOfInputs(e.target.name, e.target.files[0].name)}/>}*/}
                {/*                </div>*/}
                {/*                <div className="inputs">*/}
                {/*                    <label htmlFor="company">Company</label>*/}
                {/*                    <input placeholder={keeper.company} name = "company" type="text" onChange={(e) =>{ makeArrayOfInputs(e.target.name, e.target.value)}}/>*/}
                {/*                </div>*/}
                {/*                <div className="inputs">*/}
                {/*                    <label htmlFor="position">Position</label>*/}
                {/*                    <input placeholder={keeper.position} name = "position" type="text" onChange={(e) => makeArrayOfInputs(e.target.name, e.target.value)}/>*/}
                {/*                </div>*/}
                {/*                <div className="inputs">*/}
                {/*                    <label htmlFor="duration">Duration</label>*/}
                {/*                    <input placeholder={keeper.duration} name = "duration" list="autocomplete-list-update" type="text" onChange={(e) => {handleInputChange(e); makeArrayOfInputs(e.target.name, e.target.value);}}/>*/}
                {/*                    <datalist id="autocomplete-list-update">*/}
                {/*                        <option value="Full time" />*/}
                {/*                        <option value="12-months" />*/}
                {/*                    </datalist>*/}
                {/*                </div>*/}
                {/*                <div className="inputs">*/}
                {/*                    <label htmlFor="job_id">Job_id#</label>*/}
                {/*                    <input placeholder={keeper.job_id} name = "job_id" type="text" onChange={(e) => makeArrayOfInputs(e.target.name, e.target.value)}/>*/}
                {/*                </div>*/}
                {/*                <div className="inputs">*/}
                {/*                    <label htmlFor="status">Status</label>*/}
                {/*                    <input placeholder={keeper.status} name = "status" type="text" onChange={(e) => makeArrayOfInputs(e.target.name, e.target.value)}/>*/}
                {/*                </div>*/}
                {/*            </form>*/}

                {/*            <div className="buttons">*/}
                {/*                <div className="button">*/}
                {/*                    <button onClick={() => {*/}
                {/*                        requestToServerForUpdate(inputValues, keeper, isVisible);*/}
                {/*                    }*/}
                {/*                    }*/}
                {/*                    >Submit</button></div>*/}
                {/*                <div className="button"><button onClick={() => {*/}
                {/*                    setModalActiveForUpdate(false);*/}
                {/*                    const id = document.getElementById('form');*/}
                {/*                    id.reset();*/}
                {/*                    setIsVisible(false)}}>Cancel</button></div>*/}
                {/*                <div className="button"><button onClick={() => setIsVisible(true)}>Изменить картинку</button></div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
            </Modal>
        </div>
    );
}
export default StatusBoard;