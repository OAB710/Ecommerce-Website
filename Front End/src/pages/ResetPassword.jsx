import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const resetPassword = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    let responseData;

    await fetch(`http://localhost:4000/resetpassword/${token}`, {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    })
    .then((response) => response.json())
    .then((data) => responseData = data);

    if (responseData.success) {
      alert("Password reset successfully");
      navigate("/login");
    } else {
      setErrorMessage(responseData.message);
    }
  };

  return (
    <section className="max_padd_container flexCenter flex-col pt-32">
      <div className="max-w-[555px] h-[600px] bg-white m-auto px-14 py-10 rounded-md">
        <h3 className="h3">Reset Password</h3>
        <div className="flex flex-col gap-4 mt-7">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="New Password"
            className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
          />
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm New Password"
            className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
          />
        </div>
        {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
        <button
          onClick={resetPassword}
          className="btn_dark_rounded my-5 w-full rounded-md"
        >
          Reset Password
        </button>
      </div>
    </section>
  );
};

export default ResetPassword;