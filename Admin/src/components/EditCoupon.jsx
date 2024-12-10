import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdSave } from "react-icons/md";

export const EditCoupon = () => {
  const { couponId } = useParams();
  const navigate = useNavigate();
  const [couponDetails, setCouponDetails] = useState({
    code: "",
    discount: "",
    expirationDate: "",
    used: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch coupon details
    const fetchCouponDetails = async () => {
      const response = await fetch(`http://localhost:4000/coupon/${couponId}`);
      const data = await response.json();
      setCouponDetails(data);
    };

    fetchCouponDetails();
  }, [couponId]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setCouponDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!couponDetails.code) {
      newErrors.code = "Coupon code is required";
    }
    if (!couponDetails.discount) {
      newErrors.discount = "Discount is required";
    } else if (isNaN(couponDetails.discount)) {
      newErrors.discount = "Discount must be a number";
    }
    if (!couponDetails.expirationDate) {
      newErrors.expirationDate = "Expiration date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveCoupon = async () => {
    if (!validate()) {
      return;
    }

    await fetch(`http://localhost:4000/editcoupon/${couponId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(couponDetails),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.success) {
          alert("Coupon updated successfully");
          navigate("/listcoupon");
        } else {
          setErrors({ ...errors, general: data.message });
        }
      });
  };

  return (
    <div className="p-8 box-border bg-white w-full rounded-sm mt-4 lg:m-7">
      {errors.general && <div className="text-red-500 mb-4">{errors.general}</div>}
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
        {errors.code && <div className="text-red-500">{errors.code}</div>}
      </div>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Discount:</h4>
        <input
          value={couponDetails.discount}
          onChange={changeHandler}
          type="text"
          name="discount"
          placeholder="Type here.."
          className="bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md"
        />
        {errors.discount && <div className="text-red-500">{errors.discount}</div>}
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
        {errors.expirationDate && <div className="text-red-500">{errors.expirationDate}</div>}
      </div>
      <div className="mb-3 flex items-center gap-x-4">
        <h4 className="bold-18 pb-2">Available: </h4>
        <select
          name="used"
          className="bg-primary ring-1 ring-slate-900/20 medium-16 rounded-sm outline-none"
          value={couponDetails.used}
          onChange={(e) =>
            setCouponDetails((prevDetails) => ({
              ...prevDetails,
              used: e.target.value === "true",
            }))
          }
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </div>
      <button onClick={saveCoupon} className="btn_dark_rounded mt-4 flexCenter gap-x-1">
        <MdSave /> Save Coupon
      </button>
    </div>
  );
};

export default EditCoupon;