import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {signInStart,signInFail,signInSuccess} from '../redux/userSlice.js';
import { useDispatch, useSelector } from "react-redux";
import OAuth from '../components/OAuth.jsx'
export default function SignIn() {
  const [credential, setCredential] = useState({});
  const {loading, error} = useSelector((state)=>state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleOnChange = (e) => {
    setCredential({ ...credential, [e.target.name]: e.target.value });
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart(loading));
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credential),
      });
      const resData = await res.json();
      if (resData.success === false) {
        return dispatch(signInFail(resData.message));
      }
      dispatch(signInSuccess(resData));
      navigate("/");
    } catch (error) {
      dispatch(signInFail(error.message));
    }
  };
  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-center my-7 font-semibold text-3xl">Sign-in</h1>
      <form onSubmit={handleOnSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          id="email"
          name="email"
          placeholder="email"
          className="p-3 rounded-lg border"
          value={credential.email}
          onChange={handleOnChange}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
          className="p-3 rounded-lg border"
          value={credential.password}
          onChange={handleOnChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 rounded-lg text-white hover:opacity-95 p-3"
        >
          {loading ? "Loading..." : "SIGNIN"}
        </button>
        <OAuth/>
      </form>
      <div className="flex my-2 gap-2">
        <p className="text-slate-500">Dont have a account</p>
        <Link to="/sign-up" className="text-blue-500">
          Sign Up
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
