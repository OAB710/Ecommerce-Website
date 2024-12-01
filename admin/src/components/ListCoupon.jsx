import React, { useState, useEffect } from 'react';
import { TbTrash } from "react-icons/tb";

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

  return (
    <div className="p-2 box-border bg-white mb-6 rounded-sm w-full mt-4 sm:p-4 sm:m-7">
      <h4 className="bold-22 p-5 uppercase">Coupons List</h4>

      <div className="max-h-[77vh] overflow-auto px-4 text-center">
        <table className="w-full mx-auto">
          <thead>
            <tr className="bg-primary bold-14 sm:regular-22 text-start py-12">
              <th className="p-2">Code</th>
              <th className="p-2">Discount</th>
              <th className="p-2">Creation Time</th>
              <th className="p-2">Expiration Date</th>
              <th className="p-2">Used</th>
              <th className="p-2">Remove</th>
            </tr>
          </thead>
          <tbody>
            {allCoupons.map((coupon, i) => (
              <tr key={i} className="border-b border-slate-900/20 text-gray-20 p-6 medium-14">
                <td>{coupon.code}</td>
                <td>{coupon.discount}</td>
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