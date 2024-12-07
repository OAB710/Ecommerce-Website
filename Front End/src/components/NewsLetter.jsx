import React, { useState } from 'react';

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
    try {
      const response = await fetch('http://localhost:4000/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Subscription successful! Please check your email.');
      } else {
        setMessage('Subscription failed. Please try again.');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <section className="max_padd_container py-12 xl:py-28 bg-white">
      <div className="mx-auto xl:x-[80%] flexCenter flex-col gap-y-8 w-full max-w-[666px]">
        <h3 className="h3">Get Exclusive offers on Your Email</h3>
        <h4 className="uppercase bold-18">Subscribe to our newsletter and stay updated</h4>
        <div className="flexBetween rounded-full ring-1 ring-slate-900/10 hover:ring-slate-900/15 bg-primary w-full max-w-[588px]">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full bg-transparent ml-7 border-none outline-none regular-16"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn_dark_rounded" onClick={handleSubscribe}>
            Subscribe
          </button>
        </div>
        {message && <p>{message}</p>}
      </div>
    </section>
  );
};

export default NewsLetter;