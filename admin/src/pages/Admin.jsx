import React from 'react';
import Sidebar from '../components/Sidebar';
import AddProduct from '../components/AddProduct';
import ListProduct from '../components/ListProduct';

import EditProduct from '../components/EditProduct';
import ListUser from '../components/ListUser';
import EditUser from '../components/EditUser';
import ListOrder from '../components/ListOrder';
import ViewOrder from '../components/ViewOrder'; // Import ViewOrder component
import Dashboard from '../components/Dashboard';
import AddCoupon from '../components/AddCoupon';
import ListCoupon from '../components/ListCoupon';

import { Routes, Route } from "react-router-dom";

const Admin = () => {
  return (
    <div className='lg:flex'>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/listproduct" element={<ListProduct />} />

        <Route path="/editproduct/:productId" element={<EditProduct />} />
        <Route path="/listuser" element={<ListUser />} />
        <Route path="/edituser/:userId" element={<EditUser />} />
        <Route path="/listorder" element={<ListOrder />} />
        <Route path="/vieworder/:orderId" element={<ViewOrder />} /> {/* Add route for viewing order details */}

        <Route path="/addcoupon" element={<AddCoupon />} />
        <Route path="/listcoupon" element={<ListCoupon />} />

      </Routes>
    </div>
  );
}

export default Admin;