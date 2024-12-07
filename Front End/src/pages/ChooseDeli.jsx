import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const Delivery = () => {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch addresses from the server
    fetch("http://localhost:4000/shipping-addresses", {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("auth-token"),
      },
    })
      .then((response) => response.json())
      .then((data) => setAddresses(data.addresses))
      .catch((error) => console.error("Error fetching addresses:", error));
  }, []);

  const handleDelete = (index) => {
    fetch(`http://localhost:4000/delete-address/${index}`, {
      method: "DELETE",
      headers: {
        "auth-token": localStorage.getItem("auth-token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAddresses((prevAddresses) => prevAddresses.filter((_, i) => i !== index));
        } else {
          console.error("Error deleting address:", data.message);
        }
      })
      .catch((error) => console.error("Error deleting address:", error));
  };

  const handleEdit = (index) => {
    navigate(`/delivery-detail/${index}`);
  };

  const handleAddNew = () => {
    navigate("/adddele");
  };

const chooseDeli = (index) => {
  const selectedDeli = addresses[index];

  // Navigate to the cart page with selected delivery information
  navigate('/cart-page', { state: { name: selectedDeli.name, contact: selectedDeli.contact, address: selectedDeli.address } });
};

  return (
    <div className="bg-gray-100 min-h-screen mt-5">
      <div className="max-w-4xl mx-auto p-4 mt-16">
        <h1 className="text-2xl font-bold mb-4">My Addresses</h1>
        <button
            className="mb-4 bg-yellow-200 text-yellow-800 px-4 py-2 rounded flex items-center"
            onClick={handleAddNew}
          >
            <FaPlus className="mr-2" /> New Delivery Information
          </button>
        {addresses.map((address, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow mb-4">
            <h2 className="text-lg font-semibold">{address.name}</h2>
            <p className="mt-2">Contact: {address.contact}</p>
            <p className="text-gray-600">{address.address}</p>
            <button
              className="mt-2 bg-green-200 text-green-800 px-4 py-2 rounded"
              onClick={() => chooseDeli(index)}
            >
              Choose This Delivery
            </button>
            <button
              className="ml-2 mt-2 bg-blue-200 text-blue-800 px-4 py-2 rounded"
              onClick={() => handleEdit(index)}
            >
              Change Delivery Information
            </button>
            <button
              className="ml-2 mt-2 bg-orange-200 text-orange-800 px-4 py-2 rounded"
              onClick={() => handleDelete(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Delivery;