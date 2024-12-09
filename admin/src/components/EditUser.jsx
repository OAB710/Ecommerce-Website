import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdSave, MdAdd, MdRemove } from "react-icons/md";

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    addresses: [""], // Initialize with an array
    role: "customer",
    isBanned: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch user details
    const fetchUserDetails = async () => {
      const response = await fetch(`http://localhost:4000/user/${userId}`);
      const data = await response.json();
      setUserDetails(data);
    };

    fetchUserDetails();
  }, [userId]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const addressChangeHandler = (index, value) => {
    const updatedAddresses = [...userDetails.address];
    updatedAddresses[index] = value;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      address: updatedAddresses,
    }));
  };

  const addAddress = () => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      address: [...prevDetails.address, ""],
    }));
  };

  const removeAddress = (index) => {
    const updatedAddresses = userDetails.address.filter((_, i) => i !== index);
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      address: updatedAddresses,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (userDetails.email && !/\S+@\S+\.\S+/.test(userDetails.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!userDetails.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(userDetails.phone)) {
      newErrors.phone = "Phone number must contain only digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveUser = async () => {
    if (!validate()) {
      return;
    }

    await fetch(`http://localhost:4000/edituser/${userId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.success) {
          alert("User updated successfully");
          navigate("/listuser");
        } else {
          setErrors({ ...errors, general: data.message });
        }
      });
  };

  return (
    <div className="p-8 box-border bg-white w-full rounded-sm mt-4 lg:m-7">
      {errors.general && <div className="text-red-500 mb-4">{errors.general}</div>}
      <div className="mb-3">
        <h4 className="bold-18 pb-2">User Name:</h4>
        <input
          value={userDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here.."
          className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
        />
      </div>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Email:</h4>
        <input
          value={userDetails.email}
          onChange={changeHandler}
          type="email"
          name="email"
          placeholder="Type here.."
          className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
        />
        {errors.email && <div className="text-red-500">{errors.email}</div>}
      </div>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Phone:</h4>
        <input
          value={userDetails.phone}
          onChange={changeHandler}
          type="text"
          name="phone"
          placeholder="Type here.."
          className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
        />
        {errors.phone && <div className="text-red-500">{errors.phone}</div>}
      </div>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Address:</h4>
        <input
          value={userDetails.address}
          onChange={changeHandler}
          type="text"
          name="phone"
          placeholder="Type here.."
          className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
        />
        {errors.phone && <div className="text-red-500">{errors.phone}</div>}
      </div>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Shipping Address:</h4>
        {userDetails.addresses.map((addr, index) => (
          <div key={index} className="flex items-center gap-x-4 mb-2">
            <input
              value={addr.address}
              onChange={(e) => addressChangeHandler(index, e.target.value)}
              type="text"
              name={`address-${index}`}
              placeholder="Type here.."
              className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
            />
          </div>
        ))}
      </div>
      <div className="mb-3 flex items-center gap-x-4">
        <h4 className="bold-18 pb-2">User Role:</h4>
        <select
          name="role"
          className="bg-primary ring-1 ring-slate-900/20 medium-16 rounded-sm outline-none"
          value={userDetails.role}
          onChange={changeHandler}
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="mb-3 flex items-center gap-x-4">
        <h4 className="bold-18 pb-2">Banned:</h4>
        <select
          name="isBanned"
          className="bg-primary ring-1 ring-slate-900/20 medium-16 rounded-sm outline-none"
          value={userDetails.isBanned}
          onChange={(e) =>
            setUserDetails((prevDetails) => ({
              ...prevDetails,
              isBanned: e.target.value === "true",
            }))
          }
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </div>
      <button onClick={saveUser} className="btn_dark_rounded mt-4 flexCenter gap-x-1">
        <MdSave /> Save User
      </button>
    </div>
  );
};

export default EditUser;