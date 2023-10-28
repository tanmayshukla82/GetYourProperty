import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import { useDispatch } from "react-redux";
import {app} from '../../firebase.js'; 
import { deleteUserFail, deleteUserStart, deleteUserSuccess, signOutUserFail, signOutUserStart, signOutUserSuccess, updateFail, updateStart, updateSuccess } from "../redux/userSlice.js";
import { Link, useNavigate } from "react-router-dom";
export default function Profile() {
  const dispatch = useDispatch();
  const { currentUser,loading } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const [file, setFile] = useState(undefined);
  const [filePerc,setFilePerc] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingError, setShowListingError] = useState("");
  const [userList, setUserList] = useState([]);
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
  const handleSignOut = async()=>{
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signOut');
      const resData = await res.json();
      dispatch(signOutUserSuccess(resData));
      navigate("/sign-in");
    } catch (error) {
      dispatch(signOutUserFail(error.message));
    }
  };
  const handleShowList = async()=>{
    try {
      const res = await fetch(`/api/listing/getListing/${currentUser._id}`);
      const resData = await res.json();
      setUserList(resData);
    } catch (error) {
      setShowListingError("Something went wrong");
    }
  }
  const handleDeleteUserList = async(id)=>{
    try {
      const res = await fetch(`/api/listing/deleteUserList/${id}`);
      const resData = await res.json();
      if(resData.success === false){
        return setShowListingError("Unable to delete");
      }
      const flteredList = 
        userList.filter((list)=>{
          return list._id!==id;})

      setUserList(flteredList);
    } catch (error) {
      showListingError("Unable to delete");
    }
  }
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
        <Link
          to="create-listing"
          className="uppercase bg-green-700 p-3 text-center text-white rounded-lg"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between my-2">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      {showListingError.length > 0 && (
        <p className="text-red-700 text-center">{showListingError}</p>
      )}
      <button onClick={handleShowList} className="text-green-700 w-full">
        Show Listing
      </button>
      {userList.length > 0 && (
          <p className="text-center text-gray-700 text-3xl font-semibold">
            Your Listing
          </p>
        ) &&
        userList.map((list) => {
          return (
            <>
              <div
                key={list._id}
                className="border border-gray-300 p-3 flex items-center justify-between rounded-lg gap-4 mt-5"
              >
                <Link to={`/listing/${list._id}`}>
                  <img
                    src={list.images[0]}
                    alt=""
                    className="rounded-lg object-contain w-16 h-16"
                  />
                </Link>
                <Link to={`/listing/${list._id}`} className="flex-1">
                  <p className="font-semibold text-gray-700 hover:underline">
                    {list.name}
                  </p>
                </Link>
                <div className="flex flex-col">
                  <button className="text-green-700">EDIT</button>
                  <button
                    onClick={() => handleDeleteUserList(list._id)}
                    className="text-red-700"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </>
          );
        })}
    </div>
  );
}
