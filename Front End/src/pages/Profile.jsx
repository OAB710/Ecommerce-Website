import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    LoyaltyPoints: "",
    email: "",
    phone: "",
    address: "",
    addresses: [],
    password: "",
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("auth-token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setProfile(data);
        }
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }, []);

  const handleManageShipping = () => {
    navigate("/delivery");
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [id]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [id]: value,
    }));
  };

  const verifyOldPassword = async () => {
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: profile.email, password: passwords.oldPassword }),
      });
      const data = await response.json();
      return data.token ? true : false;
    } catch (error) {
      console.error("Error verifying old password:", error);
      return false;
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const profileData = { ...profile };
  
    if (showPasswordFields) {
      if (passwords.newPassword !== passwords.confirmNewPassword) {
        alert("Passwords do not match");
        return;
      }
  
      const isOldPasswordValid = await verifyOldPassword();
      if (!isOldPasswordValid) {
        alert("Old password is incorrect");
        return;
      }
  
      profileData.password = passwords.newPassword;
    }
  
    console.log("Profile Data to be updated:", profileData);
  
    try {
      const response = await fetch("http://localhost:4000/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify(profileData),
      });
  
      if (response.ok) {
        console.log("Profile updated successfully:", profileData);
        alert("Profile updated successfully");
      } else {
        console.log("Failed to update profile:", profileData);
        alert("Failed to update profile");
      }
    } catch (error) {
      console.log("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      fetch("http://localhost:4000/profile", {
        method: "DELETE",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            alert(data.message);
            localStorage.removeItem("auth-token");
            navigate("/login");
          }
        })
        .catch((error) => console.error("Error deleting account:", error));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 mt-5">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mt-20">
        <h1 className="text-2xl font-bold mb-6">My Account</h1>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="name"
            >
              Name *
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              id="name"
              type="text"
              value={profile.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-red-500 font-bold mb-2"
              htmlFor="points"
            >
              Loyalty Points
            </label>
            <input
              className="w-full px-3 py-2 border rounded bg-gray-200"
              id="points"
              type="text"
              value={profile.LoyaltyPoints}
              disabled
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="email"
            >
              Email *
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              id="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <div className="w-full">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="phone"
              >
                Phone *
              </label>
              <input
                className="w-full px-3 py-2 border rounded"
                id="phone"
                type="text"
                value={profile.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="address"
            >
              Address *
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              id="address"
              type="text"
              value={profile.address}
              onChange={handleChange}
              required
            />
          </div>
          {showPasswordFields && (
            <>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="oldPassword"
                >
                  Old Password *
                </label>
                <input
                  className="w-full px-3 py-2 border rounded"
                  id="oldPassword"
                  type="password"
                  value={passwords.oldPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="newPassword"
                >
                  New Password *
                </label>
                <input
                  className="w-full px-3 py-2 border rounded"
                  id="newPassword"
                  type="password"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="confirmNewPassword"
                >
                  Confirm New Password *
                </label>
                <input
                  className="w-full px-3 py-2 border rounded"
                  id="confirmNewPassword"
                  type="password"
                  value={passwords.confirmNewPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </>
          )}
          <h1 className="mb-6 text-blue-500">
            <span
              style={{ cursor: "pointer" }}
              className="underline hover:text-red-500"
              onClick={handleManageShipping}
            >
              Click here to manage your shipping information
            </span>
          </h1>
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <button
                type="submit"
                className="w-1/2 px-4 py-2 bg-blue-500 text-white font-bold rounded"
              >
                UPDATE PROFILE
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordFields(!showPasswordFields)}
                className="w-1/2 px-4 py-2 bg-gray-500 text-white font-bold rounded"
              >
                CHANGE PASSWORD
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="w-full px-4 py-2 border bg-yellow-500 text-white font-bold rounded"
            >
              MY ORDERS
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full px-4 py-2 bg-red-500 text-white font-bold rounded"
            >
              DELETE ACCOUNT
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full px-4 py-2 border border-black text-black font-bold rounded"
            >
              EXIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;