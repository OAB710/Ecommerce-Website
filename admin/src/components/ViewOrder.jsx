import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const response = await fetch(`http://localhost:4000/order/${orderId}`);
      const data = await response.json();
      if (data.success) {
        setOrderDetails(data.order);
        setStatus(data.order.status);
      } else {
        console.error('Error fetching order details:', data.message);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const updateOrderStatus = async () => {
    await fetch(`http://localhost:4000/updateorderstatus/${orderId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.success) {
          alert("Order status updated successfully");
          navigate("/listorder");
        } else {
          alert("Update failed");
        }
      });
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
  };

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 box-border bg-white w-full rounded-sm mt-4 lg:m-7">
      <h4 className="bold-22 uppercase">Order Details</h4>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Buyer's Name:</h4>
        <p>{orderDetails.user ? orderDetails.user.name : 'Unknown User'}</p>
      </div>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Purchase Time:</h4>
        <p>{new Date(orderDetails.date).toLocaleString()}</p>
      </div>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Total Amount:</h4>
        <p>{formatPrice(orderDetails.total)}</p>
      </div>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Order Status:</h4>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipping">Shipping</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
      <button onClick={updateOrderStatus} className="btn_dark_rounded mt-4 flexCenter gap-x-1">
        Update Status
      </button>
      <div className="mt-4">
        <h4 className="bold-18 pb-2">Products:</h4>
        <ul>
          {orderDetails.products.map((product, index) => (
            <li key={index}>
              {product.name} - {product.variants?.size || 'N/A'}, {product.variants?.color || 'N/A'} - {product.quantity} x {formatPrice(product.price)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewOrder;