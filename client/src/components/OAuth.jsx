import {GoogleAuthProvider,getAuth,signInWithPopup} from 'firebase/auth';
import {app} from '../../firebase.js';
import { useDispatch } from "react-redux";
import { signInSuccess } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleAuth = async() => {
    // code to authenticate with google and get access token
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth,provider);
      console.log(result);
      const res = await fetch('/api/auth/googleAuth',{
        method:'POST',
        headers:{
          'Content-type':'application/json',
        },
        body:JSON.stringify({name:result.user.displayName,email:result.user.email,photo:result.user.photoURL})
      });
      const resData = await res.json();
      console.log(resData);
      dispatch(signInSuccess(resData));
      navigate("/");
    } catch (error) {
      console.log("Error in google auth",error);
    }
  };
  return (
    <button
      onClick={handleGoogleAuth}
      type="button"
      className="p-3 rounded-lg text-white bg-red-700 hover:opacity-95 uppercase"
    >
      Continue with google
    </button>
  );
}
