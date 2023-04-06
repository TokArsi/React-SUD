// import React, {useState, useRef, useEffect} from "react";
// import './form.scss'
//
//
// const Form = ({data, setData, modalActiveForSave, setModalActiveForSave, updatedData, setModalActiveForUpdate, modalActiveForUpdate, setUpdatedData}) => {
//     const [inputValues, setInputValues] = useState({});
//     const [isVisible, setIsVisible] = useState(false)
//     const form = useRef(null);
//     const input = useRef(null);
//     const [isNew, setIsNew] = useState(false);
//     const [formData, setFormData] = useState({});
//     const [isFileDownloaded, setIsFileDownloaded] = useState({
//         status: false,
//         url : ''
//     });
//     let arrayOfInputsValue = {};
//     console.log('formData: ', formData)
//
//
//     useEffect(()=>{
//         if (modalActiveForSave)
//             setIsNew(false);
//         else
//         {
//             form.current.reset();
//         }
//         if(modalActiveForUpdate)
//             setIsNew(true);
//         else
//         {
//             setIsNew(false);
//             form.current.reset();
//             setIsVisible(false);
//             setUpdatedData({})
//         }
//         if (isFileDownloaded.status)
//         {
//             console.log('Файл загружен')
//         }
//         if(updatedData)
//         {
//             setFormData(updatedData)
//         }
//         else {
//             setFormData(Object.keys(Object(data[0])).reduce((acc, current) => ({...acc, [current]: ''}), {}))
//         }
//     }, [modalActiveForSave, modalActiveForUpdate, isFileDownloaded])
//
//
//     const isValidForm = (e, arrayOfValidInputs) => {
//         const name = e.target.name;
//         if (e.target.value === '') {
//             e.target.classList.add('error')
//         } else
//             e.target.classList.remove('error');
//     }
//
//     const setInputValuesState = (name, value) => {
//         setInputValues(prevState => {
//             return {
//                 ...prevState,
//                 [name]: value
//             }
//         })
//     }
//
//
//     const handleInputChange = (e) => {
//         const datalist = document.getElementById(`${e.target.list.id}`);
//         const options = Array.from(datalist.options).map(o => o.value);
//         if (!Array.from(options).includes(e.target.value)) {
//             e.target.value = '';
//         }
//     };
//
//     const updateData = (copy, data) => {
//         fetch('http://localhost:3002/request-update', {
//             method: "PUT",
//             headers: new Headers({'content-type': 'application/json', 'boundary': 'something'}),
//             body: JSON.stringify(copy)
//         })
//             .then((res) => res.json())
//             .then((result) => {
//                 const index = data.findIndex(item => item._id === result._id);
//                 const newData = [...data]
//                 newData[index] = result;
//                 setData(newData);
//                 setModalActiveForUpdate(false)
//             })
//     }
//
//     const updateDataWithLogo = (inputValues, keeper, isVisible) => {
//         console.log(inputValues)
//         const id = document.getElementById("form-to-update");
//         const file = document.getElementById('Logo')
//         console.log('file', file)
//         const copy = {};
//         Object.assign(copy, keeper)
//         for (let i in copy) {
//             for (let j in inputValues) {
//                 if (j === i)
//                     copy[i] = inputValues[j];
//             }
//         }
//         console.log('copy: ', copy)
//         if (isVisible) {
//             if (file.files[0]) {
//                 const formData = new FormData(id);
//                 console.log('image: ', formData.get("Logo"));
//                 fetch('http://localhost:3002/images', {
//                     method: 'POST',
//                     body: formData
//                 })
//                     .then((res) => res.json())
//                     .then((result) => {
//                         copy.Logo = result;
//                         return copy;
//                     })
//                     .then((copy) => {
//                         updateData(copy, data);
//                     })
//             } else (alert('Выберите файл, чтобы изменить данные'))
//         } else {
//             updateData(copy, data);
//         }
//     }
//
//     // const saveNewData = (inputValues) => {
//     //     console.log(inputValues)
//     //     const id = document.getElementById("form-to-save");
//     //     const formData = new FormData(id);
//     //     console.log(formData.get("Logo"))
//     //     fetch('http://localhost:3002/images', {
//     //         mode: 'cors',
//     //         method: 'POST',
//     //         body: formData
//     //     })
//     //         .then((res) => res.json()
//     //             .then((response) => {
//     //                 inputValues.Logo = response;
//     //                 console.log(inputValues)
//     //             }))
//     //         .then(() => {
//     //                 fetch('http://localhost:3002/post-request', {
//     //                     mode: 'cors',
//     //                     method: 'POST',
//     //                     headers: new Headers({'content-type': 'application/json', 'boundary': 'something'}),
//     //                     body: JSON.stringify(inputValues)
//     //                 })
//     //                     .then(res => res.json())
//     //                     .then((result) => setData(prevState => [...prevState, result]))
//     //                     .then(() => {
//     //                         setModalActiveForSave(false);
//     //                         if(!modalActiveForSave)
//     //                             form.current.reset();
//     //                     })
//     //                     .catch((error) => console.log(error))
//     //             }
//     //         )
//     //
//     // }
//
//     const OnSubmit = (isNew, e) => {
//         e.preventDefault();
//         if(isNew) {
//             updateDataWithLogo(inputValues, updatedData, isVisible);
//             setModalActiveForUpdate(false);
//             setIsVisible(false);
//             form.current.reset();
//         }
//         else {
//             saveNewData(inputValues);
//             setModalActiveForSave(false);
//             form.current.reset();
//         }
//     }
//
//     const showLogo = (e) => {
//         const file = e.target.files[0];
//         const reader = new FileReader();
//         reader.onload = () => {
//             setIsFileDownloaded({status: true, url: reader.result});
//         }
//         reader.readAsDataURL(file);
//     }
//
//     return (
//         <form className="form" ref = {form}
//               id = {isNew
//                   ? "form-to-update"
//                   : "form-to-save"}
//               onSubmit={(e) => OnSubmit(isNew, e)}
//         >
//             <div className="form-group-wrapper">
//                 {Object.keys(Object(data[0])).map((item, index) =>
//                 {
//                     if (item!=='_id' && !isNew)
//                         return (
//                             <div key={index} className="form-group">
//                                 <label htmlFor={item}>{item}</label>
//                                 <input type={item === 'Logo'
//                                     ? 'file'
//                                     : 'text'}
//                                        name = {item}
//                                        className={item === 'Logo'
//                                            ? "form-field-logo"
//                                            : "form-field"}
//                                        ref  = {item === 'Logo'
//                                            ? input
//                                            : null}
//                                        onChange={(e) => {
//                                            setInputValuesState(e.target.name, e.target.value);
//                                            isValidForm(e);
//                                            if (item === 'Logo') {
//                                            }
//                                            }}
//                                 />
//                             </div>
//                         )
//                     else
//                     if (isNew === true && item!=='_id')
//                         return (
//                             <div key={index} className="form-group">
//                                 <label htmlFor={item}>{item}</label>
//                                 <input id={item=== 'Logo'
//                                     ? item
//                                     : null}
//                                        type={item === 'Logo'
//                                            ? 'file'
//                                            : 'text'}
//                                        defaultValue={updatedData[item]}
//                                        name = {item}
//                                        className={item === 'Logo'
//                                            ? "form-field-logo"
//                                            : "form-field"}
//                                        hidden = {item === 'Logo'
//                                            ? !isVisible
//                                            : null
//                                        }
//                                        ref  = {item === 'Logo'
//                                            ? input
//                                            : null}
//                                        onChange={(e) => {
//                                            setInputValuesState(e.target.name, e.target.value);
//                                            isValidForm(e);
//                                        }}
//                                 />
//                             </div>
//                         )
//                 })}
//                 <button type="submit">Submit</button>
//                 {isNew &&
//                     <button
//                     type="button"
//                     onClick={() => setIsVisible(true)}
//                     >Change logo</button>}
//                 <button type="button"
//                         onClick={() => {
//                             if(isNew === true) {
//                                 setModalActiveForUpdate(false);
//                             }
//                             else {
//                                 setModalActiveForSave(false);
//                             }
//                         }}>Close</button>
//             </div>
//             <div className="form-logo">
//                 {isFileDownloaded.status && <img src={isFileDownloaded.url} alt=""/>}
//             </div>
//         </form>
//     );
//             }
// export default Form;
