import React, {useState, useEffect} from 'react'
import './statusboard.scss'
import {Modal} from "../Modal/Modal"
import Form from "../FormComponent/Form.js"
import FormGenerator from "../ReusableForm/FormGenerator";


const deletedItems = (data, checkedCheckBoxes) => data.filter((item) => !checkedCheckBoxes.includes(item._id))
const StatusBoard = () => {
    const [data, setData] = useState([]);
    const [modalActiveForSave, setModalActiveForSave] = useState(false);
    const [modalActiveForUpdate, setModalActiveForUpdate] = useState(false);
    const [updatedData, setUpdatedData] = useState({})
    const [deletedData, setDeletedData] = useState([])
    const [searchValue, setSearchValue] = useState(null);
    const [originalData, setOriginalData] = useState([]);
    const [checked, setChecked] = useState(false);
    const [inputValues, setInputValues] = useState({});
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        fetch("http://localhost:3002/board-data")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                return data;
            })
            .then((data) => {
                setData(data);
                setOriginalData(data);
            })
        if(!modalActiveForUpdate)
            setUpdatedData({})
    }, [])

    const setInputValuesState = (e) => {
        setInputValues(prevState => {
            return {
                ...prevState,
                [e.target.name]: e.target.value
            }
        })
    }
    const saveNewData = (e) => {
        console.log(inputValues)
        const id = document.getElementById(e.target.id);
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
                        })
                        .catch((error) => console.log(error))
                }
            )
        setModalSaveClose()
    }

    const updateData = (copy, data) => {
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
            })
    }

    const updateDataWithLogo = (e) => {
        console.log(inputValues)
        const id = document.getElementById(e.target.id);
        const file = document.getElementById('Logo')
        console.log('file', file.files[0])
        const copy = {};
        Object.assign(copy, updatedData)
        for (let i in copy) {
            for (let j in inputValues) {
                if (j === i)
                    copy[i] = inputValues[j];
            }
        }
        console.log('copy: ', copy)
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
                        updateData(copy, data);
                    })
            } else updateData(copy, data);
        setModalUpdateClose()
    }

    const deleteItems = (deletedData) => {
        if (deletedData.length !== 0)
            fetch('http://localhost:3002/request-delete', {
                method: "DELETE",
                headers: new Headers({'content-type': 'application/json', 'boundary': 'something'}),
                body: JSON.stringify(deletedData)
            })
                .then((res) => {
                    const result = deletedItems(data, deletedData);
                    setData(result);
                    data.map((item) => {
                        const p = document.getElementById(item._id);
                        return item;
                    })
                })
                .catch(error => alert(`Can not delete.\n Error description: ${error}`))

        else console.log("Id's array is empty!!!");
    }
    const selectCheckBox = (_id) => {
        setChecked(!checked)
        setDeletedData(prevState => {
            return prevState.includes(_id)
                ? prevState.filter((v) => v !== _id)
                : [...prevState, _id]
        })
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
                    setUpdatedData(item)
                }
            }
        )
    }

    const getSearchValue = (e) => {
        setSearchValue(e.target.value);
    }

    const handleSearchChange = (e) => {
        getSearchValue(e);
    }
    const findData = (e) => {
        {
            if (e.target.value==='') {
                setData(originalData)
            }
            else {
                const searchResult = originalData.filter((objectData) => {
                    const lowerSearchValue = searchValue.toLowerCase();
                    if (Object.values(objectData).map((stringData) => stringData.toLowerCase()).includes(lowerSearchValue))
                    {
                        return objectData;
                    }
                })
                setData(searchResult);
            }
        }
    }
    const handleKeyPress = (e) => {
        if (e.keyCode===13) {
            findData(e)
        }
    }
    const setModalSaveClose = () => {
        setModalActiveForSave(false);
    }
    const setModalUpdateClose = () => {
        setModalActiveForUpdate(false);
    }

    const formElementsUpdate =
        {
             title: 'Update data',
             inputAttributes: {
                names: Object.keys(Object(data[0])).filter(item => item!=='_id') ,
                defaultValue:
                    Object.keys(updatedData).reduce((acc, current) => {
                        if(current!=='_id')
                            return [...acc, updatedData[current]];
                        else return [...acc]
                    }, []),
                 types: ['file', 'text', 'text', 'text', 'text', 'text'],
                 placeholders: [
                     '',
                     'Enter company name...',
                     'Enter position name...',
                     'Enter duration name...',
                     'Enter Job_ID number...',
                     'Enter Status name...',
                 ],
                 OnChange: [setInputValuesState]
             },
            formButtons: {
                submitButtonName: 'Update',
                resetButtonName: 'Reset',
                buttons: [
                    {
                        type: 'button',
                        name: 'Close',
                        OnClick: setModalUpdateClose
                    }
                ],
            },
            OnSubmit: updateDataWithLogo
        }
    const formElementsSave =
        {
            title  : 'Save data',
            inputAttributes: {
                names : Object.keys(Object(data[0])).filter(item => item!=='_id') ,
                defaultValue: '',
                types: ['file', 'text', 'text', 'text', 'text', 'text'],
                placeholders: [
                    '',
                    'Enter company name...',
                    'Enter position name...',
                    'Enter duration name...',
                    'Enter Job_ID number...',
                    'Enter Status name...',
                ],
                OnChange: [setInputValuesState],
            },
            formButtons: {
                submitButtonName: 'Save',
                resetButtonName: 'Reset',
                buttons: [
                    {
                    type: 'button',
                    name: 'Close',
                    OnClick: setModalSaveClose
                }
                ],
            },
            OnSubmit: saveNewData
        }



    console.log(formElementsUpdate);
    console.log(formElementsSave);
    console.log(inputValues)
    // console.log('updatedData: ', updatedData)



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
                    <div className="tool search">
                        <input
                            id="status-board-search-input"
                            type="text"
                            placeholder="Keywords ..."
                            onChange={handleSearchChange}
                            onKeyDown={(e) => handleKeyPress(e)}
                        />
                        <img
                            src="/img/search-option.png"
                            alt=""
                            onClick={findData}
                        />
                    </div>
                    <div id="delete-option" className="tool" onClick={() => {
                        const isConfirmed = window.confirm('Are you sure about deleting data?');
                        if (isConfirmed)
                            deleteItems(deletedData);
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
                                        <input
                                            type="checkbox"
                                            defaultChecked={checked}
                                            onChange={() =>
                                                selectCheckBox(_id)}/>
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
                                                dataForUpdate(_id, updatedData, data);
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
                                                deleteItems([_id])
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
                <FormGenerator
                    formData={formElementsSave}
                    formActive={modalActiveForSave}
                />

                {/*<Form*/}
                {/*    data = {data}*/}
                {/*    setData = {setData}*/}
                {/*    modalActiveForSave = {modalActiveForSave}*/}
                {/*    setModalActiveForSave = {setModalActiveForSave}*/}
                {/*    updated = {updatedData}*/}
                {/*    setUpdatedData={setUpdatedData}*/}
                {/*/>*/}
            </Modal>
            <Modal keeper={updatedData} setKeeper={setUpdatedData} active={modalActiveForUpdate} setActive={setModalActiveForUpdate}>
                <FormGenerator
                    formData={formElementsUpdate}
                    formActive={modalActiveForUpdate}
                />
                {/*<Form*/}
                {/*    data={data}*/}
                {/*    setData={setData}*/}
                {/*    setModalActiveForUpdate={setModalActiveForUpdate}*/}
                {/*    updatedData={updatedData}*/}
                {/*    modalActiveForUpdate={modalActiveForUpdate}*/}
                {/*    setUpdatedData={setUpdatedData}*/}
                {/*/>*/}
            </Modal>
        </div>
    );
}
export default StatusBoard;