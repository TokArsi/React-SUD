import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Home from "./components/Home/Home";
import DataContext from "./contexts/DataContext";
import FormPage from "./components/FormPage/FormPage";

function App() {
    const [formInformation, setFormInformation] = useState({});
    const [updatedData, setUpdatedData] = useState({});
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [modalActiveForSave, setModalActiveForSave] = useState(false);
    const [modalActiveForUpdate, setModalActiveForUpdate] = useState(false);
    const [deletedData, setDeletedData] = useState([])
    const [oldLogoFileNames, setOldLogoFileNames] = useState([]);
    const createNewData = (e, inputValues) => {
        console.log(inputValues)
        const id = document.getElementById(e.target.id);
        const formData = new FormData(id);
        console.log(formData.get("Logo"))
        Promise.all([
            uploadImage(formData, inputValues)
        ])
            .then(() => fetch('http://localhost:3002/post-request', {
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
                .catch((error) => console.log(error)))
        setModalSaveClose()
    }
    const selectOldLogoFileNames = (fileName) => {
        setOldLogoFileNames(prevState => [...prevState, fileName])
    }
    const deleteOldLogo = (oldLogoFileNames) => {
        console.log('oldLogoFileNames',oldLogoFileNames)
        return fetch('http://localhost:3002/request-delete-logo', {
            method: "DELETE",
            headers: new Headers({'content-type': 'application/json', 'boundary': 'something'}),
            body: JSON.stringify(oldLogoFileNames)
        })
            .then(res => {
                if (res.status !== 200) {
                    throw new Error('Server responded with an error');
                }
                setOldLogoFileNames([]);
                return res.json();
            })
            .catch(error => {
                console.error(error);
            });
    }
    const uploadImage = (formData, inputValues) => {
        return fetch('http://localhost:3002/images', {
            method: 'POST',
            body: formData
        })
            .then((res) => res.json())
            .then((result) => {
                inputValues.Logo = result;
                console.log(inputValues);
                return inputValues;
            })
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

    const updateDataWithLogo = (e, inputValues) => {
        const id = document.getElementById(e.target.id);
        const file = document.getElementById('Logo');
        if(updatedData.Logo)
        {
            const oldLogoFileName = updatedData.Logo.split('/').pop();
            selectOldLogoFileNames(oldLogoFileName);
        }
        Object.keys(inputValues).map((item)=>{
            const v = updatedData;
            v[item] = inputValues[item]
            setUpdatedData(v)
        })
        console.log('updatingData: ', updatedData)
        if (file.files[0]) {
            const formData = new FormData(id);
            console.log('image: ', formData.get('Logo'));
            Promise.all([uploadImage(formData, updatedData)
                .then((updatedData) => updateData(updatedData, data))
                .catch(error => {
                    console.error(error);
                })
            ])
                .then(() => {
                    return deleteOldLogo(oldLogoFileNames);
                })
        } else updateData(updatedData, data);
        setModalUpdateClose()
    }
    const setModalSaveClose = () => {
        setModalActiveForSave(false);
    }
    const setModalUpdateClose = () => {
        setModalActiveForUpdate(false);
    }

    return (
    <div className="App">
      <header className="App-header">
      </header>
        <div className="container">
            <DataContext.Provider value={{
                formInformation, setFormInformation,
                updatedData, setUpdatedData,
                createNewData, updateData,
                updateDataWithLogo, deletedData,
                data, setData, modalActiveForSave,
                setModalActiveForSave, modalActiveForUpdate,
                setModalActiveForUpdate, uploadImage,
                setDeletedData, originalData,
                setOriginalData, selectOldLogoFileNames,
                deleteOldLogo, oldLogoFileNames,
                setModalUpdateClose, setModalSaveClose,
            }}>
                <Router>
                    <Routes>
                        <Route path={`/`} element={<Home/>}/>
                        <Route path="*" element={<h2>Sorry</h2>} />
                        <Route
                            path={`/form/:id`}
                            element={<FormPage formInformation={formInformation}/>}
                        />
                    </Routes>
                </Router>
            </DataContext.Provider>
        </div>
    </div>
  );
}
export default App;
