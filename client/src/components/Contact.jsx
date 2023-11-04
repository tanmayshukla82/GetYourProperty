/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
export default function Contact({listing}) {
  const [user,setUser] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/getUser/${listing.userRef}`);
        const resData = await res.json();
        setUser(resData);
        console.log(resData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);
  return (
    user && (
      <div className="flex flex-col gap-2">
        <p className="text-gray-500">
          contact{" "}
          <span className="text-gray-700 font-semibold">{user.username}</span>{" "}
          for <span className="text-gray-700 font-semibold">{listing.name}</span>
        </p>
        <textarea
          name="message"
          id="message"
          rows="2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message here..."
          className="w-full border p-3 rounded-lg"
        ></textarea>

        <Link
          to={`mailto:${user.email}?subject=Regarding ${listing.name}&body=${message}`}
          className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
        >
          Send Message
        </Link>
      </div>
    )
  );
}
