import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TbTrash } from "react-icons/tb";
import newcouponIcon from "../assets/new-coupon.png"; // Add an icon for coupons

const ListCoupon = () => {
  const [allCoupons, setAllCoupons] = useState([]);

  const fetchCoupons = async () => {
    await fetch('http://localhost:4000/allcoupons')
      .then((res) => res.json())
      .then((data) => {
        setAllCoupons(data);
      });
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const removeCoupon = async (id) => {
    await fetch('http://localhost:4000/removecoupon', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    });
    await fetchCoupons();
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
  };

  return (
    <div className="p-2 box-border bg-white mb-6 rounded-sm w-full mt-4 sm:p-4 sm:m-7">
      <div className="flex justify-between items-center p-5">
        <h4 className="bold-22 uppercase">Coupons List</h4>
        <Link to="/addcoupon">
          <button className="flexCenter gap-2 rounded-md bg-primary h-12 w-44 xs:w-44 medium-16">
            <img src={newcouponIcon} alt="New Coupon " height={50} width={50} />
            <span>Add Coupon</span>
          </button>
        </Link>
      </div>

      <div className="max-h-[77vh] overflow-auto px-4 text-center">
        <table className="w-full mx-auto">
          <thead>
            <tr className="bg-primary bold-14 sm:regular-22 text-start py-12">
              <th className="p-2">Code</th>
              <th className="p-2">Discount</th>
              <th className="p-2">Creation Time</th>
              <th className="p-2">Expiration Date</th>
              <th className="p-2">Available</th>
              <th className="p-2">Remove</th>
            </tr>
          </thead>
          <tbody>
            {allCoupons.map((coupon, i) => (
              <tr key={i} className="border-b border-slate-900/20 text-gray-20 p-6 medium-14">
                <td>{coupon.code}</td>
                <td>{formatPrice(coupon.discount)}</td>
                <td>{new Date(coupon.creationTime).toLocaleString()}</td>
                <td>{new Date(coupon.expirationDate).toLocaleDateString()}</td>
                <td>{coupon.used ? 'Yes' : 'No'}</td>
                <td>
                  <div className="bold-22 pl-6 sm:pl-14">
                    <TbTrash onClick={() => removeCoupon(coupon._id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListCoupon;