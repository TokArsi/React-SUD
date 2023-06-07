import React, {useState, useEffect, useContext} from 'react'
import {useNavigate} from 'react-router-dom';
import './statusboard.scss'
import {Modal} from "../Modal/Modal"
import FormGenerator from "../ReusableForm/FormGenerator";
import input from "../Input/Input";
import DataContext from "../../contexts/DataContext";

const StatusBoard = () => {

    const [searchValue, setSearchValue] = useState(null);
    const [checked, setChecked] = useState(false);
    const navigate = useNavigate();
    const {setFormInformation,
        updatedData, setUpdatedData,
        createNewData,
        updateDataWithLogo, deletedData,
        data, setData, modalActiveForSave,
        setModalActiveForSave, modalActiveForUpdate,
        setModalActiveForUpdate,
        setDeletedData, originalData,
        setOriginalData, selectOldLogoFileNames,
        deleteOldLogo, oldLogoFileNames,
        setModalUpdateClose, setModalSaveClose,
    } = useContext(DataContext);

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
        // if(!modalActiveForUpdate)
        //     setUpdatedData({})
    }, []);

    console.log(updatedData)

    const getOldFileNames = (deletedData) => {
        data.map((item) => {
            if(deletedData.includes(item._id))
                selectOldLogoFileNames(item.Logo.split('/').pop())
        })
    }

    const deletedItems = (data, checkedCheckBoxes) => data.filter((item) => !checkedCheckBoxes.includes(item._id))

    const deleteItems = (deletedData) => {
        if (deletedData)
        {
            getOldFileNames(deletedData);
            fetch('http://localhost:3002/request-delete', {
                method: "DELETE",
                headers: new Headers({'content-type': 'application/json', 'boundary': 'something'}),
                body: JSON.stringify(deletedData)
            })
                .then(() => {
                    const result = deletedItems(data, deletedData);
                    setData(result);
                })
                .then(() => {
                    return deleteOldLogo(oldLogoFileNames);
                })
                .catch(error => alert(`Can not delete.\n Error description: ${error}`))
        }
        else console.log("Id's array is empty!!!");
    }

    const formElementsUpdate =
        {
            type: 'Update',
            title: 'Update Role',
            Inputs: [
                {
                    name: 'Logo',
                    value: `${updatedData.Logo}`,
                    type: 'file',
                    placeholder: '',
                    className: '',
                    OnChange: () => console.log('update')
                },
                {
                    name: 'Company',
                    value: `${updatedData.Company}`,
                    type: 'text',
                    placeholder: '',
                    className: '',
                    OnChange: () => console.log('update')
                },
                {
                    name: 'Position',
                    value: `${updatedData.Position}`,
                    type: 'text',
                    placeholder: '',
                    className: '',
                    dataList: ['Visual Designer', 'Product Designer', 'Interactive Designer', 'UI/UX Designer'],
                    OnChange: () => console.log('update')
                },
                {
                    name: 'Duration',
                    value: `${updatedData.Duration}`,
                    type: 'text',
                    placeholder: '',
                    className: '',
                    dataList: ['Full-time', '12-months'],
                    OnChange: () => console.log('update')
                },
                {
                    name: 'Job_ID',
                    value: `${updatedData.Job_ID}`,
                    type: 'text',
                    placeholder: '',
                    className: '',
                    OnChange: () => console.log('create')
                },
                {
                    name: 'Status',
                    value: `${updatedData.Status}`,
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
                {
                    type: 'button',
                    name: 'Close',
                    className: '',
                    OnClick: () => {setModalUpdateClose()}
                }
            ],
            OnSubmit: (e, values) => updateDataWithLogo(e, values)
        }

    const formElementsCreate =
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
                    OnClick: () =>  setModalSaveClose()
                }
            ],
            OnSubmit:  (e, values)=> createNewData(e, values)
        }

    const handleClick = (id) => {
        navigate(`/form/${id}`);
    };
    const handleCreateData = () => {
        navigate(`/form/create`);
    }

    const selectCheckBox = (_id) => {
        setChecked(!checked)
        setDeletedData(prevState => {
            return prevState.includes(_id)
                ? prevState.filter((v) => v !== _id)
                : [...prevState, _id]
        })
    }

    const dataForUpdate = (id, data) => {
           data.map((item) => {
                if (item._id === id) {
                     setUpdatedData(item);
                }
            }
        )
    }
    const handleKeyPress = (e) => {
        if (e.keyCode===13) {
            findData(e)
        }
    }
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
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
    console.log(formElementsUpdate);
    console.log(formElementsCreate);

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
                                                dataForUpdate(_id, data)
                                                setModalActiveForUpdate(true);
                                                handleClick(_id);
                                            }} src="/img/pencil-edit.png" alt=""/>
                                        </div>
                                    </div>
                                </td>
                                <td className="td-data tool-deleter">
                                    <div className="deleter">
                                        <img onClick={() => {
                                            const isConfirmed = window.confirm('Are you sure about deleting this data?');
                                            if (isConfirmed) {
                                                deleteItems([_id]);
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
            <button onClick={() => handleCreateData()}>Create a new role in new page</button>
            <Modal active={modalActiveForSave} setActive={setModalActiveForSave}>
                {modalActiveForSave && <FormGenerator
                    formData={formElementsCreate}
                    formActive={modalActiveForSave}
                />}
            </Modal>
            <Modal active={modalActiveForUpdate} setActive={setModalActiveForUpdate}>
                {modalActiveForUpdate && <FormGenerator
                    formData={formElementsUpdate}
                    formActive={modalActiveForUpdate}
                />}
            </Modal>
        </div>
    );
}
export default StatusBoard;