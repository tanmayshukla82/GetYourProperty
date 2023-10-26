import { useState } from "react";
import { app } from "../../firebase.js"; 
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject
} from "firebase/storage";
export default function Listing() {
  const [images, setImages] = useState([]);
  const {currentUser} = useSelector(state=>state.user);
  const [formData, setFormData] = useState({
    images: [],
    type: "sell",
    bathrooms: 1,
    bedrooms: 1,
    regularPrice: 0,
    discountedPrice: 0,
    userRef: currentUser.email,
    offer: false,
    parking: false,
    furnished:false
  });
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const handleImages = ()=>{
    setUploading(true);
    if(images.length > 0 && images.length<7){
      const promises = [];
      for(let i=0;i<images.length;i++){
        promises.push(storeImage(images[i]));
      }
      Promise.all(promises).then((downloadURLs)=>{
        setFormData({
          ...formData,
          images: formData.images.concat(downloadURLs),
        })
        setUploading(false);
      }).catch((err)=>{
        setImageError(err);
      })
    }else{
      setImageError('You can only upload upto 6 images');
      setUploading(false);
    }
  }
  const storeImage = (file)=>{
    return new Promise((resolve,reject)=>{
      // logic to save image in firebase and get url of the saved image
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        () => {
          reject("Maximum size of a image in 2MB")
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURLs) => {
            resolve(downloadURLs);
          });
        }
      );
    })
  }
  const handleDeleteImage = (url)=>{
    const filteredImagedata = formData.images.filter((image)=>{
      return image!==url;
    });
    setFormData({...formData,images:filteredImagedata});
    const storage = getStorage();

    // Create a reference to the file to delete
    const desertRef = ref(storage, url);

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        console.log("deleted!!");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handleFormData = (e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
  }
  const handleCheckBox = (e)=>{
    if(e.target.name=='sell' || e.target.name=='rent'){
      setFormData({...formData, type:e.target.name});
    }else{
    setFormData({...formData,[e.target.name]:e.target.checked});}
  }
  const handleSubmitList = async(e)=>{
    e.preventDefault();
    const res = await fetch('/api/listing/create',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(formData)
    })
    const data = await res.json();
    console.log(data);
  }
  return (
    <main className="p-3 max-w-3xl mx-auto">
      <h1 className="font-semibold text-3xl text-center my-7">
        Create Listing
      </h1>
      <form onSubmit={handleSubmitList} className="flex flex-col sm:flex-row">
        <div className="flex flex-col flex-1 gap-4">
          <input
            type="text"
            name="name"
            className="rounded-lg p-3 border border-gray-300"
            placeholder="Name"
            onChange={handleFormData}
            value={formData.name}
          />
          <textarea
            className="rounded-lg p-3 border border-gray-300"
            name="description"
            placeholder="Description"
            onChange={handleFormData}
            value={formData.description}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="rounded-lg p-3 border border-gray-300"
            onChange={handleFormData}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" name="sell" checked={formData.type==='sell'} onChange={handleCheckBox}/>
              <span>Sell</span>
            </div>
            <div className="flex gap-3">
              <input type="checkbox" className="w-5" name="rent" checked={formData.type==='rent'} onChange={handleCheckBox}/>
              <span>Rent</span>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                className="w-5"
                name="parking"
                onChange={handleCheckBox}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                className="w-5"
                name="furnished"
                onChange={handleCheckBox}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                className="w-5"
                name="offer"
                onChange={handleCheckBox}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-5 flex-wrap">
            <div className="flex gap-3 items-center">
              <input
                type="number"
                className="rounded-lg p-3 border border-gray-300 w-14"
                name="bedrooms"
                required
                min='1'
                onChange={handleFormData}
                value={formData.bedrooms}
              />
              <span>Beds</span>
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                className="rounded-lg p-3 border border-gray-300 w-14"
                name="bathrooms"
                onChange={handleFormData}
                value={formData.bathrooms}
                min='1'
              />
              <span>Baths</span>
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                className="rounded-lg p-3 border border-gray-300 w-15"
                name="regularPrice"
                onChange={handleFormData}
                value={formData.regularPrice}
                min='0'
              />
              <div className="flex flex-col items-center">
                <span>Regular Price</span>
                <span className="text-xs">(&#8377;/Month)</span>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                className="rounded-lg p-3 border border-gray-300 w-15"
                name="discountPrice"
                onChange={handleFormData}
                value={formData.discountPrice}
                min='0'
              />
              <div className="flex flex-col items-center">
                <span>Discounted Price</span>
                <span className="text-xs">(&#8377;/Month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 sm:ml-5">
          <div>
            <p className="font-semibold">
              Images:
              <span className="font-normal text-gray-700 ml-2">
                The first image will be the cover (max 6)
              </span>
            </p>
          </div>
          <div className="flex my-3">
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              className="border boder-gray-700 w-full p-3 rounded-lg"
              onChange={(e) => setImages(e.target.files)}
            />
            <button
              type="button"
              onClick={handleImages}
              className="uppercase text-green-700 border border-green-700 rounded-lg p-2 hover:shadow-lg disabled:opacity-95"
            >
              {uploading ? "uploading.." : "upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">{imageError && imageError}</p>
          {formData.images &&
            formData.images.map((image) => {
              return (
                <div key={image} className="p-3 flex justify-between">
                  <img
                    src={image}
                    className="w-4/12 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image)}
                    className="text-red-700 uppercase"
                  >
                    DELETE
                  </button>
                </div>
              );
            })}
          <button className="uppercase p-3 bg-gray-700 text-white rounded-lg hover:opacity-95">
            create listing
          </button>
        </div>
      </form>
    </main>
  );
}
