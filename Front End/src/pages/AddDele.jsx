import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddDele = () => {
  const [address, setAddress] = useState({
    name: "",
    contact: "",
    address: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:4000/add-address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify(address),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
        } else {
          console.error("Error adding address:", data.message);
        }
      })
      .catch((error) => console.error("Error adding address:", error));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 mt-5">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mt-20">
        <h1 className="text-2xl font-bold mb-6">Add New Address</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
              Name *
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              id="name"
              type="text"
              name="name"
              value={address.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="contact">
              Contact *
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              id="contact"
              type="text"
              name="contact"
              value={address.contact}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="address">
              Address *
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              id="address"
              type="text"
              name="address"
              value={address.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded"
            >
              SAVE
            </button>
            <button
              type="button"
              onClick={() => navigate((-1))}
              className="w-full px-4 py-2 border border-black text-black font-bold rounded"
            >
              RETURN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDele;