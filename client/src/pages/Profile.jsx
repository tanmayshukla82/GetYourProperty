import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import { useDispatch } from "react-redux";
import {app} from '../../firebase.js'; 
import { deleteUserFail, deleteUserStart, deleteUserSuccess, updateFail, updateStart, updateSuccess } from "../redux/userSlice.js";
import { useNavigate } from "react-router-dom";
export default function Profile() {
  const dispatch = useDispatch();
  const { currentUser,loading } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const [file, setFile] = useState(undefined);
  const [filePerc,setFilePerc] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file]);
  const handleFileUpload = (file)=>{
    //upload to firebase server here
    const storage = getStorage(app);
    const fileName = new Date().getTime()+file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
    (snapshot)=>{
      const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      setFilePerc(Math.round(progress));
    },
    () =>{
      setFileError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
        setFormData({...formData, avatar:downloadURL});
      })
    })
  }
  const handleOnChange = (e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
  }
  const handleOnSubmit = async(e)=>{
    e.preventDefault();
    try {
      dispatch(updateStart(loading));
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const resData = await res.json();
      if(resData.success===false){
        return dispatch(updateFail(resData.message));
      }
      dispatch(updateSuccess(resData));
    } catch (error) {
      dispatch(updateFail(error.message));
    }
  }
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`api/user/delete/${currentUser._id}`,{
        method:"DELETE"
      });
      const resData = await res.json();
      if(resData.success === false){
        dispatch(deleteUserFail(resData.message));
      }
      dispatch(deleteUserSuccess());
      navigate('/sign-in');
    } catch (error) {
      dispatch(deleteUserFail(error.message));
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-center text-3xl font-semibold my-7">Profile</h1>
      <form onSubmit={handleOnSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          className="rounded-full w-24 h-24 self-center cursor-pointer object-cover"
          src={formData.avatar || currentUser.avatar}
          alt="Profile"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-center">
          {fileError ? (
            <span className="text-red-700">Error in file upload</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-yellow-500">{`${filePerc}% uploaded`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">File Uploaded!!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          name="username"
          className="rounded-lg p-3"
          defaultValue={currentUser.username}
          onChange={handleOnChange}
          placeholder="username"
        />
        <input
          type="email"
          name="email"
          className="rounded-lg p-3"
          defaultValue={currentUser.email}
          onChange={handleOnChange}
          placeholder="email"
        />
        <input
          type="password"
          name="password"
          className="rounded-lg p-3"
          placeholder="password"
          value={formData.password}
          onChange={handleOnChange}
        />
        <button className="uppercase bg-slate-700 text-white rounded-lg p-3">
          update
        </button>
      </form>
      <div className="flex justify-between my-2">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700">Sign out</span>
      </div>
    </div>
  );
}
