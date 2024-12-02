import React, { useState } from 'react';

const AddCoupon = () => {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:4000/addcoupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, discount, expirationDate }),
    });

    const data = await response.json();
    if (data.success) {
      alert('Coupon added successfully');
      setCode('');
      setDiscount('');
      setExpirationDate('');
    } else {
      alert('Failed to add coupon');
    }
  };

  return (
    <div className="p-8 box-border bg-white w-full rounded-sm mt-4 lg:m-7">
      <h4 className="bold-22 uppercase">Add Coupon</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="bold-18 pb-2">Coupon Code:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
            required
          />
        </div>
        <div className="mb-3">
          <label className="bold-18 pb-2">Discount:</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
            required
          />
        </div>
        <div className="mb-3">
          <label className="bold-18 pb-2">Expiration Date:</label>
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
            required
          />
        </div>
        <button type="submit" className="btn_dark_rounded mt-4 flexCenter gap-x-1">
          Add Coupon
        </button>
      </form>
    </div>
  );
};

export default AddCoupon;