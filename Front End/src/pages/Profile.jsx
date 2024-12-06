import React, { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUserData = async () => {
      const response = await fetch("http://localhost:4000/profile", {
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
        },
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      } else {
        setErrorMessage(data.message);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const response = await fetch("http://localhost:4000/updateprofile", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    if (data.success) {
      setEditMode(false);
      setErrorMessage("");
    } else {
      setErrorMessage(data.message);
    }
  };

  return (
    <section className="max_padd_container flexCenter flex-col pt-32">
      <div className="max-w-[555px] bg-white m-auto px-14 py-10 rounded-md">
        <h3 className="h3">Profile</h3>
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
        <div className="flex flex-col gap-4 mt-7">
          <input
            name="name"
            value={user.name}
            onChange={handleChange}
            type="text"
            placeholder="Your Name"
            className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
            disabled={!editMode}
          />
          <input
            name="email"
            value={user.email}
            onChange={handleChange}
            type="email"
            placeholder="Email Address"
            className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
            disabled={!editMode}
          />
          <input
            name="phone"
            value={user.phone}
            onChange={handleChange}
            type="text"
            placeholder="Phone Number"
            className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
            disabled={!editMode}
          />
          <input
            name="address"
            value={user.address}
            onChange={handleChange}
            type="text"
            placeholder="Address"
            className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
            disabled={!editMode}
          />
        </div>
        {editMode ? (
          <button
            onClick={handleSave}
            className="btn_dark_rounded my-5 w-full rounded-md"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="btn_dark_rounded my-5 w-full rounded-md"
          >
            Edit Profile
          </button>
        )}
      </div>
    </section>
  );
};

export default Profile;