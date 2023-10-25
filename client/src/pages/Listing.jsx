export default function Listing() {
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
            />
            <button className="uppercase text-green-700 border border-green-700 rounded-lg p-2 hover:shadow-lg disabled:opacity-95">
              upload
            </button>
          </div>
          <button className="uppercase p-3 bg-gray-700 text-white rounded-lg hover:opacity-95">
            create listing
          </button>
        </div>
      </form>
    </main>
  );
}
