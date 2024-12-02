import React from 'react';
import Sidebar from '../components/Sidebar';
import AddProduct from '../components/AddProduct';
import ListProduct from '../components/ListProduct';
import EditProduct from '../components/EditProduct';
import ListUser from '../components/ListUser';
import EditUser from '../components/EditUser';
import ListOrder from '../components/ListOrder';
import ViewOrder from '../components/ViewOrder';
import Dashboard from '../components/Dashboard';
import AddCoupon from '../components/AddCoupon';
import ListCoupon from '../components/ListCoupon';
import Statistic from '../components/Statistic'; // Import Statistic component
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
        <Route path="/vieworder/:orderId" element={<ViewOrder />} />
        <Route path="/addcoupon" element={<AddCoupon />} />
        <Route path="/listcoupon" element={<ListCoupon />} />
        <Route path="/statistic" element={<Statistic />} /> {/* Add route for Statistic */}
      </Routes>
    </div>
  );
}

export default Admin;