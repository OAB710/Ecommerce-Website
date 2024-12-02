import { useState } from "react";
import { MdAdd } from "react-icons/md";

const AddCoupon = () => {
  const [couponDetails, setCouponDetails] = useState({
    code: "",
    discount: "",
    expirationDate: "",
  });

  const changeHandler = (e) => {
    setCouponDetails({ ...couponDetails, [e.target.name]: e.target.value });
  };

  const addCoupon = async () => {
    console.log(couponDetails);
    let responseData;

    await fetch('http://localhost:4000/addcoupons', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(couponDetails),
    })
    .then((resp) => resp.json())
    .then((data) => {
      responseData = data;
      data.success ? alert('Coupon Added') : alert('Failed to Add Coupon');
    });

    if (responseData.success) {
      setCouponDetails({ code: "", discount: "", expirationDate: "" });
    }
  };

  return (
    <div className="p-8 box-border bg-white w-full rounded-sm mt-4 lg:m-7">
      <h2 className="bold-22 pb-4">Add Coupon</h2>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Coupon Code:</h4>
        <input
          value={couponDetails.code}
          onChange={changeHandler}
          type="text"
          name="code"
          placeholder="Type here.."
          className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
        />
      </div>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Discount Value:</h4>
        <input
          value={couponDetails.discount}
          onChange={changeHandler}
          type="text"
          name="discount"
          placeholder="Type here.."
          className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
        />
      </div>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Expiration Date:</h4>
        <input
          value={couponDetails.expirationDate}
          onChange={changeHandler}
          type="date"
          name="expirationDate"
          className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
        />
      </div>
      <button onClick={addCoupon} className="btn_dark_rounded mt-4 flexCenter gap-x-1">
        <MdAdd /> Add Coupon
      </button>
    </div>
  );
};

export default AddCoupon;