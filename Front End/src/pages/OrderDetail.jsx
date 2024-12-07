import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/order/${orderId}`, {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
          },
        });
        const data = await response.json();
        if (data.success) {
          setOrderDetails(data.order);
        } else {
          console.error("Failed to fetch order details:", data.message);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 box-border bg-white w-full rounded-sm mt-4 lg:m-7">
      <h4 className="bold-22 uppercase">Order Details</h4>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Buyer's Name:</h4>
        <p>{orderDetails.name}</p>
      </div>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Purchase Time:</h4>
        <p>{new Date(orderDetails.date).toLocaleString()}</p>
      </div>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Total Amount:</h4>
        <p>{orderDetails.total} đ</p>
      </div>
      <div className="mb-3">
        <h4 className="bold-18 pb-2">Order Status:</h4>
        <p>{orderDetails.status}</p>
      </div>
      <div className="mt-4">
        <h4 className="bold-18 pb-2">Products:</h4>
                <ul>
          {orderDetails.products.map((product, index) => (
            <li key={index} className="mb-2">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold">{product.name}</p>
                  <p>Quantity: {product.quantity}</p>
                </div>
                <div>
                  <p>{product.price} đ</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h4 className="bold-18 pb-2">Summary:</h4>
        <div className="flex justify-between">
          <p className="font-bold">Total:</p>
          <p>{orderDetails.total} đ</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;