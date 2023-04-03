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
    const [isHovered, setIsHovered] = useState(false);
    const [searchValue, setSearchValue] = useState(null);
    const [originalData, setOriginalData] = useState([]);
    console.log(searchValue)

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
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const getSearchValue = (e) => {
        setSearchValue(e.target.value);
    }

    const handleSearchChange = (e) => {
        getSearchValue(e);

    }
    const findData = (e) => {
        {
            if (e.target.value === '') {
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
        if (e.keyCode === 13) {
            findData(e)
        }
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
            </Modal>
            <Modal keeper={keeper} setKeeper={setKeeper} active={modalActiveForUpdate} setActive={setModalActiveForUpdate}>
                <Form
                    data = {data}
                    setData = {setData}
                    setModalActiveForUpdate= {setModalActiveForUpdate}
                    keeper = {keeper}
                    modalActiveForUpdate = {modalActiveForUpdate}
                />
            </Modal>
        </div>
    );
}
export default StatusBoard;