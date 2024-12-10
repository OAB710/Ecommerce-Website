import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import withAuth from "../components/withAuth";
const Order = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(3); // Number of orders per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:4000/myorders", {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
          },
        });
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          console.error("Failed to fetch orders:", data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/updateorderstatus/${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Cancel" }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "Cancel" } : order
          )
        );
        alert("Order cancelled successfully");
      } else {
        alert("Failed to cancel order: " + data.message);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("An error occurred while cancelling the order");
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  // Get current orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section>
      <div className="bg-gray-100 min-h-screen mt-5">
        <div className="max-w-4xl mx-auto p-4 mt-16">
          <h1 className="text-2xl font-bold mb-4">My Orders</h1>
          {currentOrders.map((order, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow mb-4">
              <h2 className="text-lg font-semibold">
                {order._id} - {new Date(order.date).toLocaleDateString()}
              </h2>
              <p className="mt-2">
                <span className="font-bold">Shipping Information:</span>{" "}
                {order.name}, {order.phone}, {order.shippingAddress}
              </p>
              <p className="mt-2">
                <span className="font-bold">Total:</span>{" "}
                {order.total < 0 ? 0 : order.total}đ
              </p>
              <p className="mt-1">
                <span className="font-bold">Status: </span>
                <span className="bg-yellow-200 px-2 py-1 rounded">
                  {order.status}
                </span>
              </p>
              <button
                className="mt-2 bg-blue-200 text-blue-800 px-4 py-2 rounded"
                onClick={() => handleViewDetails(order._id)}
              >
                View Details
              </button>
              {order.status === "pending" && (
                <button
                  className="ml-2 mt-2 bg-red-200 text-red-800 px-4 py-2 rounded"
                  onClick={() => handleCancelOrder(order._id)}
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
          <Pagination
            itemsPerPage={ordersPerPage}
            totalItems={orders.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </section>
  );
};

export default withAuth(Order);
