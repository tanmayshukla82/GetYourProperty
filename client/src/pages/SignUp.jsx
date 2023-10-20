import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
export default function SignUp() {
  const [credential,setCredential] = useState({}); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleOnChange = (e)=>{
    setCredential({...credential, [e.target.name]:e.target.value});
  }
  const handleOnSubmit = async(e)=>{
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup',{
        method:'POST',
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(credential)
      });
      const resData = await res.json();
      if(resData.success === false){
        setError(res.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate(
        '/signin'
      );
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }
  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-center my-7 font-semibold text-3xl">Sign-up</h1>
      <form onSubmit={handleOnSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          id="username"
          name="username"
          placeholder="username"
          className="p-3 rounded-lg border"
          value={credential.username}
          onChange={handleOnChange}
        />
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
        <button disabled={loading} className="bg-slate-700 rounded-lg text-white hover:opacity-95 p-3">
          {loading?'Loading...':'SIGNUP'}
        </button>
      </form>
      <div className="flex my-2 gap-2">
        <p className="text-slate-500">Already a user?</p>
        <Link to="/sign-in" className="text-blue-500">
          Sign In
        </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
}
