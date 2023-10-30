import {FaSearch} from 'react-icons/fa'
import {Link, useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [searchTerm,setSearchTerm] = useState("");
  const handleSearchTerm = (e)=>{
    e.preventDefault();
    const searchParams = new URLSearchParams(location.search); 
    searchParams.set('searchTerm',searchTerm);
    const searchQuery = searchParams.toString();
    navigate(`/search?${searchQuery}`);
  }
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const urlQuery = urlParams.get('searchTerm');
    setSearchTerm(urlQuery || "");
  },[location.search])
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
          <span className="text-slate-300">Get</span>
          <span className="text-slate-500">Your</span>
          <span className="text-slate-700">Property</span>
        </h1>
        <form onSubmit={handleSearchTerm} className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className=" text-slate-700 hover:underline"> Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
