
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc'
  })
  const handleChange = (e)=>{
    if(e.target.name==='all'||e.target.name==='sell'||e.target.name==='rent'){
      setFormData({...formData, type:e.target.name});
    }
    else if(e.target.name==='offer'||e.target.name==='parking'||e.target.name==='furnished')
    {
      setFormData({...formData, [e.target.name]:e.target.checked || e.target.checked==='true'?true:false});
    }
    else{
      const sort = e.target.value.split('_')[0];
      const order = e.target.value.split('_')[1];
      setFormData({...formData,sort,order});
    }
  }
  const handleSubmit = (e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm',formData.searchTerm);
    urlParams.set('offer',formData.offer);
    urlParams.set('parking',formData.parking);
    urlParams.set('furnished',formData.furnished);
    urlParams.set('type',formData.type);
    urlParams.set('sort',formData.sort);
    urlParams.set('order',formData.order);
    const urlQuery = urlParams.toString();
    navigate(`/search?${urlQuery}`);
  }
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("searchTerm");
    const offer = urlParams.get("offer");
    const parking = urlParams.get("parking");
    const furnished = urlParams.get("furnished");
    const type = urlParams.get("type");
    const sort = urlParams.get("sort");
    const order = urlParams.get("order");
    setFormData({...formData,
      searchTerm:searchTerm||'',
      offer:offer==='true'?true:false,
      parking:parking==='true'?true:false,
      furnished:furnished==='true'?true:false,
      type:type||'all',
      sort:sort||'created_at', 
      order:order||'desc'
    })
    const fetchListing = async()=>{
      try {
        setLoading(true);
        const urlQuery = urlParams.toString();
        const res = await fetch(`/api/listing/listings?${urlQuery}`);
        const resData = await res.json();
        if(resData.success === false){
          setError("Error in loading the list");
        }
        setListings(resData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Error in getting list");
      }
    }
    fetchListing();
  },[location.search]);
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="p-7 border-b-2 md:border-r md:min-h-screen ">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex gap-2 items-center justify-center">
              <label htmlFor="Search" className="whitespace-nowrap">
                Search Term
              </label>
              <input
                className="p-3 rounded-lg w-full"
                type="text"
                placeholder="Search..."
                value={formData.searchTerm}
                onChange={(e) =>
                  setFormData({ ...formData, searchTerm: e.target.value })
                }
              />
            </div>
            <div className="flex gap-5 flex-wrap">
              <div className="flex gap-2">
                <p>Type :</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  className="w-5"
                  name="all"
                  onChange={handleChange}
                  checked={formData.type === "all"}
                />
                <label htmlFor="all">Rent & Sale</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  className="w-5"
                  name="rent"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                <label htmlFor="rent">Rent</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  className="w-5"
                  name="sell"
                  onChange={handleChange}
                  checked={formData.type === "sell"}
                />
                <label htmlFor="sale">Sale</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  className="w-5"
                  name="offer"
                  onChange={handleChange}
                />
                <label htmlFor="offer">Offer</label>
              </div>
            </div>
            <div className="flex flex-wrap gap-5">
              <div>
                <p>Amenities :</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  name="parking"
                  className="w-5"
                  onChange={handleChange}
                />
                <label htmlFor="parking">Parking</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  name="furnoshed"
                  className="w-5"
                  onChange={handleChange}
                />
                <label htmlFor="furnished">Furnished</label>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p>Sort</p>
              <select
                onChange={handleChange}
                name="sort"
                defaultValue="createdAt_desc"
                className="p-2 rounded-lg"
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_asc">Latest</option>
                <option value="createdAt_desc">Oldest</option>
              </select>
            </div>
            <button className="p-3 uppercase text-white bg-gray-700 rounded-lg">
              search
            </button>
          </form>
          {error && <p className="text-red-700">{error}</p>}
        </div>
        <div className="ml-5 flex-1">
          <p className="my-4 text-3xl font-semibold text-gray-700">
            Your Search List
          </p>
          <div>
            {
              !loading && listings.length===0 && <p className="font-semibold text-gray-700 text-2xl pl-7">No Listing found</p>
            }
            {
              loading && <p className="text-center text-2xl">Loading...</p>
            }
          </div>
          <div>
            {
              loading===false && listings.length>0 && (
                listings.map((list)=>{
                  return <ListingItem key={list._id} listing={list} />;
                })
              )
            }
          </div>
        </div>
      </div>
    </>
  );
}
