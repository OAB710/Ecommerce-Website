import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");
  const userId = new URLSearchParams(location.search).get("id");

  const handleResetPassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }

    if (oldPassword === newPassword) {
      setMessage("New password cannot be the same as the old password");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/resetpassword/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Password reset successfully");
        navigate("/login");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <section className="max_padd_container flexCenter flex-col pt-32">
      <div className="max-w-[555px] h-[600px] bg-white m-auto px-14 py-10 rounded-md">
        <h3 className="h3">Reset Password</h3>
        <div className="flex flex-col gap-4 mt-7">
          <input
            type="text"
            value={email}
            readOnly
            className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
          />
          <input
            type="password"
            placeholder="Old Password"
            className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          onClick={handleResetPassword}
          className="btn_dark_rounded my-5 w-full rounded-md"
        >
          Reset Password
        </button>
        {message && <p className="text-red-500">{message}</p>}
      </div>
    </section>
  );
};

export default ResetPassword;