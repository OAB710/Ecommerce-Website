// import React from "react";

// const Profile = () => {
//   return (
//     <section className="min-h-screen flex items-center justify-center bg-gray-100 mt-5">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mt-20">
//         <h1 className="text-2xl font-bold mb-6">My Account</h1>
//         <form>
//           <div className="mb-4">
//             <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
//               Name *
//             </label>
//             <input
//               className="w-full px-3 py-2 border rounded"
//               id="name"
//               type="text"
//               required={true}
//             />
//           </div>
//           {/* <div className="mb-4">
//             <label className="block text-gray-700 font-bold mb-2" htmlFor="dob">
//               Date Of Birth (Date/Month/Year)
//             </label>
//             <input
//               className="w-full px-3 py-2 border rounded"
//               id="dob"
//               type="text"
//               required={true}
//             />
//           </div> */}
//           <div className="mb-4">
//             <label className="block text-red-500 font-bold mb-2" htmlFor="points">
//               Loyalty Points
//             </label>
//             <input
//               className="w-full px-3 py-2 border rounded bg-gray-200"
//               id="points"
//               type="text"
//               value="- 5 %"
//               disabled
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
//               Email *
//             </label>
//             <input
//               className="w-full px-3 py-2 border rounded"
//               id="email"
//               type="text"
//               required={true}
//             />
//           </div>
//           <div className="mb-4 flex items-center">
//             <div className="w-full">
//               <label className="block text-gray-700 font-bold mb-2" htmlFor="phone">
//                 Phone *
//               </label>
//               <input
//                 className="w-full px-3 py-2 border rounded"
//                 id="phone"
//                 type="text"
//                 required={true}
//               />
//             </div>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 font-bold mb-2" htmlFor="address">
//               Address*
//             </label>
//             <input
//               className="w-full px-3 py-2 border rounded"
//               id="address"
//               type="text"
//               required={true}
//             />
//           </div>
//           <div className="flex flex-col space-y-2">
//             <button className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded">
//               UPDATE PROFILE
//             </button>
//             <button className="w-full px-4 py-2 bg-gray-500 text-white font-bold rounded">
//               CHANGE PASSWORD
//             </button>
//             <button className="w-full px-4 py-2 border border-black text-black font-bold rounded">
//               EXIT
//             </button>
//             <button className="w-full px-4 py-2 bg-red-500 text-white font-bold rounded">
//               DELETE ACCOUNT
//             </button>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default Profile;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    LoyaltyPoints: "",
    email: "",
    phone: "",
    address: "",
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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [id]: value,
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch("http://localhost:4000/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify(profile),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          alert("Profile updated successfully!");
        }
      })
      .catch((error) => console.error("Error updating profile:", error));
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
            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
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
             <label className="block text-red-500 font-bold mb-2" htmlFor="points">
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
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
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
              <label className="block text-gray-700 font-bold mb-2" htmlFor="phone">
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
            <label className="block text-gray-700 font-bold mb-2" htmlFor="address">
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
          <div className="flex flex-col space-y-2">
  <div className="flex space-x-2">
    <button type="submit" className="w-1/2 px-4 py-2 bg-blue-500 text-white font-bold rounded">
      UPDATE PROFILE
    </button>
    <button className="w-1/2 px-4 py-2 bg-gray-500 text-white font-bold rounded">
      CHANGE PASSWORD
    </button>
  </div>
  <button type="button" onClick={() => navigate("/")} className="w-full px-4 py-2 border bg-yellow-500 text-white font-bold rounded">
    MY ORDERS
  </button>
  <button type="button" onClick={handleDelete} className="w-full px-4 py-2 bg-red-500 text-white font-bold rounded">
    DELETE ACCOUNT
  </button>
  <button type="button" onClick={() => navigate("/")} className="w-full px-4 py-2 border border-black text-black font-bold rounded">
    EXIT
  </button>
</div>
        </form>
      </div>
    </div>
  );
};

export default Profile;