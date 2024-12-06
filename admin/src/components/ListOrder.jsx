import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ListOrder = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchOrders = async (page) => {
    const query = new URLSearchParams({ page, limit: 10 }).toString();
    await fetch(`http://localhost:4000/allorders?${query}`)
      .then((res) => res.json())
      .then((data) => {
        setAllOrders(data.orders);
        setTotalPages(data.totalPages);
      });
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const view_order = (id) => {
    navigate(`/vieworder/${id}`);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
  };

  return (
    <div className="p-2 box-border bg-white mb-6 rounded-sm w-full mt-4 sm:p-4 sm:m-7">
      <div className="flex justify-between items-center p-5">
        <h4 className="bold-22 uppercase">Orders List</h4>
      </div>
      <div className="max-h-[77vh] overflow-auto px-4 text-center">
        <table className="w-full mx-auto">
          <thead>
            <tr className="bg-primary bold-14 sm:regular-22 text-start py-12">
              <th className="p-2">Order ID</th>
              <th className="p-2">User</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order, i) => (
              <tr key={i} className="border-b border-slate-900/20 text-gray-20 p-6 medium-14" style={{ height: '3em' }}>
                <td>{order._id}</td>
                <td>{order.user ? order.user.name : 'Unknown User'}</td>
                <td>{formatPrice(order.total)}</td>
                <td className={order.status === "confirmed" ? "text-green-500" : order.status === "pending" ? "text-orange-500" : ""}>
                  {order.status}
                </td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => view_order(order._id)} className="text-blue-500 hover:text-blue-700 mr-2">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default ListOrder;