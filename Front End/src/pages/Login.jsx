import React, { useState } from "react";

const Login = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    email: "",
  });
  const [isChecked, setIsChecked] = useState(false);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("Login function executed", formData);

    let responseData;

    await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (formData.email === "admin@gmail.com" && formData.password === "admin54321") {
      if (!isChecked) {
        alert(
          "You must agree to the terms of use & privacy policy to continue."
        )
        return;
      } else {
        const currentHost = window.location.host;
        if (currentHost.includes("5173")) {
          window.location.replace("http://localhost:5174");
        } else if (currentHost.includes("5174")) {
          window.location.replace("http://localhost:5173");
        }
      }
      return;
    }

    if (responseData.success) {
      if (!isChecked) {
        alert(
          "You must agree to the terms of use & privacy policy to continue."
        )
        return;
      }
      localStorage.setItem("auth-token", responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  const signup = async () => {
    console.log("Signup function executed", formData);
    let responseData;

    await fetch("http://localhost:4000/signup", {
      method: "POST",
      headers: {
        Accept: "application/json", 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      window.location.replace("/");
    } else {
    
        alert(responseData.errors);
      
    }
  };

  const forgotPassword = async () => {
    const email = prompt("Please enter your email address:");
    if (!email) return;

    let responseData;

    await fetch("http://localhost:4000/forgotpassword", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      alert("Password reset email sent. Please check your inbox.");
      navigate("/verifyotp", { state: { email } });
    } else {
      alert(responseData.errors);
    }
  };

  return (
    <section className="max_padd_container flexCenter flex-col pt-32">
      <div className="mt-24 max-w-[555px] h-[600px] bg-white m-auto px-14 py-10 rounded-md">
        <h3 className="h3">{state}</h3>
        <div className="flex flex-col gap-4 mt-7">
          {state === "Sign Up" ? (
            <>
              <input
                name="name"
                value={formData.name}
                onChange={changeHandler}
                type="text"
                placeholder="Your Name"
                className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={changeHandler}
                type="text"
                placeholder="Phone Number"
                className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
              />
            </>
          ) : (
            ""
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
            className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
            className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
          />
        </div>
        <button
          onClick={() => {
            state === "Login" ? login() : signup();
          }}
          className="btn_dark_rounded my-5 w-full rounded-md"
        >
          Continue
        </button>
        {state === "Login" && (
          <button
            onClick={forgotPassword}
            className="mb-4 text-blue-500 hover:text-blue-700 underline"
          >
            Forgot Password?
          </button>
        )}
        {state === "Sign Up" ? (
          <p className="text-black font-bold">
            Already have an account?
            <span
              onClick={() => {
                setState("Login");
              }}
              className="text-secondary underline cursor-pointer"
            >
              Login
            </span>
          </p>
        ) : (
          <p className="text-black font-bold">
            Create an account?
            <span
              onClick={() => {
                setState("Sign Up");
              }}
              className="text-secondary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
        <div className="flexCenter mt-6 gap-3">
          <input
            type="checkbox"
            name=""
            id=""
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </section>
  );
};

export default Login;