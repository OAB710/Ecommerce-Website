import React from 'react';
import Sidebar from '../components/Sidebar';
import AddProduct from '../components/AddProduct';
import ListProduct from '../components/ListProduct';
import EditProduct from '../components/EditProduct';
import ListUser from '../components/ListUser';
import EditUser from '../components/EditUser';
import { Routes, Route } from "react-router-dom";

const Admin = () => {
  return (
    <div className='lg:flex'>
      <Sidebar />
      <Routes>
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/listproduct" element={<ListProduct />} />
        <Route path="/editproduct/:productId" element={<EditProduct />} />
        <Route path="/listuser" element={<ListUser />} />
        <Route path="/edituser/:userId" element={<EditUser />} />
      </Routes>
    </div>
  );
}

export default Admin;