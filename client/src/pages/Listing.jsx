import { useState } from "react";
import { app } from "../../firebase.js"; 
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject
} from "firebase/storage";
export default function Listing() {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    images:[]
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
  return (
    <main className="p-3 max-w-3xl mx-auto">
      <h1 className="font-semibold text-3xl text-center my-7">
        Create Listing
      </h1>
      <form className="flex flex-col sm:flex-row">
        <div className="flex flex-col flex-1 gap-4">
          <input
            type="text"
            name="name"
            className="rounded-lg p-3 border border-gray-300"
            placeholder="Name"
          />
          <textarea
            className="rounded-lg p-3 border border-gray-300"
            name="description"
            placeholder="Description"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="rounded-lg p-3 border border-gray-300"
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" name="sell" />
              <span>Sell</span>
            </div>
            <div className="flex gap-3">
              <input type="checkbox" className="w-5" name="rent" />
              <span>Rent</span>
            </div>
            <div className="flex gap-3">
              <input type="checkbox" className="w-5" name="parking" />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-3">
              <input type="checkbox" className="w-5" name="furnished" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-3">
              <input type="checkbox" className="w-5" name="offer" />
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
              />
              <span>Beds</span>
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                className="rounded-lg p-3 border border-gray-300 w-14"
                name="bathrooms"
              />
              <span>Baths</span>
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                className="rounded-lg p-3 border border-gray-300 w-15"
                name="regularPrice"
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
                name="discountedPrice"
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
            <button type="button" onClick={handleImages} className="uppercase text-green-700 border border-green-700 rounded-lg p-2 hover:shadow-lg disabled:opacity-95">
              {uploading?"uploading..":"upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">{imageError && imageError}</p>
          {
            formData.images && formData.images.map((image)=>{
              return (
                <div key={image} className="p-3 flex justify-between">
                  <img src={image} className="w-4/12 object-contain rounded-lg"/>
                  <button type="button" onClick={()=>handleDeleteImage(image)} className="text-red-700 uppercase">DELETE</button>
                </div>
              );
            })
          }
          <button className="uppercase p-3 bg-gray-700 text-white rounded-lg hover:opacity-95">
            create listing
          </button>
        </div>
      </form>
    </main>
  );
}
