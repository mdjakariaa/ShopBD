import React, { useState } from "react";
import { assets } from "../assets/assets.js";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const AddItems = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      // Create a FormData object to hold the form data
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      // Send the form data to the backend, also token is sent in the headers for authentication
      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } },
      );

      // Handle the response from the backend, if the product is added successfully, reset the form fields and show a success message, otherwise show an error message
      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setPrice("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false); 
        setSizes([]);
        setBestseller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div>
        <p className="font-bold mb-2">Upload Image</p>

        <div className="flex gap-2">
          <label className="w-20 cursor-pointer" htmlFor="image1">
            <img
              className="w-20 h-20 object-cover border border-gray-300 rounded"
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt="upload area"
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>
          <label className="w-20 cursor-pointer" htmlFor="image2">
            <img
              className="w-20 h-20 object-cover border border-gray-300 rounded"
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt="upload area"
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>
          <label className="w-20 cursor-pointer" htmlFor="image3">
            <img
              className="w-20 h-20 object-cover border border-gray-300 rounded"
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt="upload area"
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>
          <label className="w-20 cursor-pointer" htmlFor="image4">
            <img
              className="w-20 h-20 object-cover border border-gray-300 rounded"
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt="upload area"
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="font-bold mb-2">Product name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      <div className="w-full">
        <p className="font-bold mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Write here"
          rows={4}
          required
        />
      </div>

      <div className="flex w-full flex-col sm:flex-row gap-2 sm:gap-8">
        <div>
          <p className="mb-2">Product category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-3 py-2"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Sub category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full px-3 py-2"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="25"
            required
          />
        </div>
      </div>

      <div>
        <p className="mb-2">Product Sizes</p>

        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size],
                )
              }
            >
              <p
                className={`${
                  sizes.includes(size)
                    ? "bg-pink-100 border border-pink-400"
                    : "bg-slate-200"
                } px-3 py-1 cursor-pointer select-none rounded`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-28 py-3 mt-4 bg-black text-white hover:bg-gray-800 transition rounded disabled:opacity-50"
      >
        {loading ? "ADDING..." : "ADD"}
      </button>
    </form>
  );
};

export default AddItems;
