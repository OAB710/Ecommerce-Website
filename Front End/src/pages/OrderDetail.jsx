import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewPopup from "./ReviewPopup"; // Import ReviewPopup component

const OrderDetail = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const response = await fetch(`http://localhost:4000/order/${orderId}`, {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
        },
      });
      const data = await response.json();
      if (data.success) {
        setOrderDetails(data.order);
        // Fetch reviews for each product in the order
        const reviewsResponse = await fetch(
          `http://localhost:4000/getreviews/${orderId}`,
          {
            method: "GET",
            headers: {
              "auth-token": localStorage.getItem("auth-token"),
            },
          }
        );
        const reviewsData = await reviewsResponse.json();
        if (reviewsData.success) {
          console.log("Reviews Data:", reviewsData.reviews); // Thêm dòng này để kiểm tra dữ liệu review
          setReviews(
            reviewsData.reviews.reduce((acc, review) => {
              acc[review.product] = review;
              return acc;
            }, {})
          );
        }
      } else {
        console.error("Error fetching order details:", data.message);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleReviewClick = (product) => {
    setSelectedProduct(product);
    setShowPopup(true);
  };

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="mt-[4.5rem] bg-gray-100 mt-5"
      style={{ backgroundColor: "#F3F4F6" }}
    >
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">ID: {orderDetails._id}</h1>
        <p className="mb-2">
          <span className="font-bold">Date: </span>{" "}
          {new Date(orderDetails.date).toLocaleDateString()}
        </p>
        <p className="mb-2">
          <span className="font-bold">Name: </span> {orderDetails.name}
        </p>
        <p className="mb-2">
          <span className="font-bold">Contact: </span> {orderDetails.phone}
        </p>
        <p className="mb-2">
          <span className="font-bold">Address: </span>{" "}
          {orderDetails.shippingAddress}
        </p>
        <p className="mb-6">
          <span className="font-bold">Status: </span> {orderDetails.status}
        </p>

        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <div className="mb-6">
          {orderDetails.products.map((product, index) => (
            <div key={index} className="flex justify-between border-b-2 py-2">
              <span>
                {product.name} / {product.variants.size} (
                {product.variants.color})
              </span>
              <span>{product.price} đ</span>
              <span>{product.quantity}</span>
              <span>{product.price * product.quantity} đ</span>
              <span className="">
                <button
                  className="text-orange-500"
                  onClick={() => handleReviewClick(product)}
                >
                  {reviews[product.product]
                    ? "View/Edit Review"
                    : "Write Review"}
                </button>
              </span>
            </div>
          ))}
        </div>
        <h2 className="text-xl font-semibold mb-4">Bill</h2>
        <div className="flex justify-between border-b-2 py-2">
          <span>Total:</span>
          <span>{orderDetails.total} đ</span>
        </div>
      </div>
      {showPopup && (
        <ReviewPopup
          product={selectedProduct}
          onClose={() => setShowPopup(false)}
          review={reviews[selectedProduct.product]}
          orderId={orderDetails._id} // Truyền orderId vào đây
        />
      )}
    </div>
  );
};

export default OrderDetail;
