import React, { useState,useEffect } from "react";
import FacebookLogin from 'react-facebook-login'
const Login = () => {

  const [state, setState] = useState("Login");

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
    phone: "",
    addresses: [{ // Change to 'addresses' (plural)
      address: "", // Keep this as 'address' (singular)
      city: "",    // Add other address fields as needed
      postalCode: "",
      country: ""
    }]
  });
  
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("Login function executed", formData);

    let responseData;

    await fetch('http://localhost:4000/login', {
      method: "POST",
      headers: {
        Accept: 'application/json', // Corrected the Accept header
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email, // Only send email and password for login
        password: formData.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => responseData = data);
      if (formData.email === 'admin@gmail.com' && formData.password === '123') {
        window.location.replace('/admin'); 
      }
    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace('/');
    }
    else {
      alert(responseData.errors);
    }
  };

  const signup = async () => {

    let responseData;
    if (!/^\w+\/\w+\/\w+$/.test(formData.address)) {
      alert("Please input the correct address format (City/Country/Postalcode)");
      return; // Stop further execution
    }
    const [city, country, postalCode] = formData.address.split("/");

    const addresses = [{
      address: formData.address,
      city: city || '',
      postalCode: postalCode || '',
      country: country || ''
    }];
    try {
      console.log({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        addresses: addresses,
        phone: formData.phone
      });
      await fetch('http://localhost:4000/signup', {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }, body: JSON.stringify({
          username: formData.name, // Send 'name' as 'username'
          email: formData.email,
          password: formData.password,
          addresses: addresses, // Send the formatted addresses array
          phone: formData.phone

        })

      })
        .then(response => {
          console.log("hello")
          // Check if the response status is not ok (not in the range 200-299)
          if (!response.ok) {
            // Throw an error to be caught by the catch block
            return response.json().then(data => {
              throw new Error(data.error); // Throw the error from the server
            });
          }
          return response.json(); // Parse the response as JSON
        })
        .then((data) => {
          responseData = data;

          if (!responseData.success) {
            // Handle errors here, e.g., show an alert
            alert(responseData.error);
          }
        });
      if (responseData.success) {
        console.log("Your account has been created");
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace('/');
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup. Please try again.");
    }



  };
  useEffect(() => {
    // Load the Facebook SDK script asynchronously
    const script = document.createElement('script');
    script.src = `https://connect.facebook.net/en_US/sdk.js`;
    script.async = true;
    document.body.appendChild(script);

    // Initialize the SDK after it has loaded
    window.fbAsyncInit = () => {
      FB.init({
        appId: '538178085716815', // Replace with your App ID
        cookie: true,
        xfbml: true,
        version: 'v18.0', // Use the latest version
      });
    };
  }, []);

  const handleFacebookLogin = (response) => {
    if (response.accessToken) {
      FB.api('/me', { fields: 'name, email' }, async (userData) => {
        if (userData && !userData.error) {
          console.log('Full user data:', userData);
  
          try {
            // Check if the user exists in MongoDB using the /login endpoint
            const checkResponse = await fetch('http://localhost:4000/login1', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: userData.email }), // Send only email
            });
            const checkData = await checkResponse.json();
            console.log(checkData)
            if (checkData.userExists) {
              // User exists, redirect to home page
              localStorage.setItem('auth-token', checkData.token); // Store the token
              window.location.replace('/');
            } else {
              // User doesn't exist, create a new account
              const newUserData = {
                username: userData.name,
                email: userData.email,
                password: 'defaultPassword', // Or generate a random password
                phone: '0909329383',
                addresses: [{
                  address: 'HCM/VietNam/12',
                  city: 'HCM',
                  postalCode: '12',
                  country: 'VietNam',
                }],
              };
  
              const createResponse = await fetch('http://localhost:4000/signup', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUserData),
              });
  
              const createData = await createResponse.json();
              if (createData.success) {
                console.log('Your account has been created');
                localStorage.setItem('auth-token', createData.token); // Store the token
                window.location.replace('/');
              } else {
                console.error('Failed to create a new account:', createData.error);
              }
            }
          } catch (error) {
            console.error('Error checking user or creating account:', error);
          }
        } else {
          console.error('Error fetching user data:', userData.error);
        }
      });
    } else {
      console.error('Facebook login failed.');
    }
  };



  return (
    <section className="max_padd_container flexCenter flex-col pt-32">
      <div className={
        state === "Login"
          ? "max-w-[555px] h-[500px] bg-white m-auto px-14 py-10 rounded-md"
          : "max-w-[555px] h-[650px] bg-white m-auto px-14 py-10 rounded-md"
      }>
        <h3 className="h3">{state}</h3>
        <div className="flex flex-col gap-4 mt-7">
          {state === "Sign Up" && ( // Conditionally render name, phone, and address fields
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
                type="tel"
                placeholder="Phone"
                className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
              />
              <input
                name="address"
                value={formData.address}
                onChange={changeHandler}
                type="text"
                placeholder="Address"
                className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
              />
            </>
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
        <button onClick={() => { state === "Login" ? login() : signup() }} className="btn_dark_rounded my-5 w-full rounded-md">Continue</button>
        <FacebookLogin
          appId="538178085716815" // Replace with your App ID
          autoLoad={true}
          fields="name,email"
          callback={handleFacebookLogin}
        />
        {state === "Sign Up" ? <p className="text-black font-bold">Already have an account?<span onClick={() => { setState("Login") }} className="text-secondary underline cursor-pointer">Login</span></p> : <p className="text-black font-bold">Create an account?<span onClick={() => { setState("Sign Up") }} className="text-secondary underline cursor-pointer">Click here</span></p>}
        <div className="flexCenter mt-6 gap-3">
          <input type="checkbox" name="" id="" />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </section>
  )
}

export default Login