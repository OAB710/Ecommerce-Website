import React from 'react';
import { Link } from "react-router-dom";
import addProduct from "../assets/addproduct.png";
import listProduct from "../assets/productlist.png";
import listUser from "../assets/listuser.png";

const Sidebar = () => {
  return (
    <div className="py-7 flex justify-center gap-x-2 gap-y-5 w-full bg-white sm:gap-x-4 lg:flex-col lg:pt-20 lg:max-w-60 lg:h-screen lg:justify-start lg:pl-6"> 
      <Link to="/addproduct">
        <button className="flexCenter gap-2 rounded-md bg-primary h-12 w-44 xs:w-44 medium-16"> 
          <img src={addProduct} alt="Add Product" height={50} width={50} />
          <span>Add Product</span>
        </button>
      </Link>
      <Link to="/listproduct">
        <button className="flexCenter gap-2 rounded-md bg-primary h-12 w-44 xs:w-44 medium-16">
          <img src={listProduct} alt="Product List" height={50} width={50} />
          <span>Product List</span> 
        </button>
      </Link>
      <Link to="/listuser">
        <button className="flexCenter gap-2 rounded-md bg-primary h-12 w-44 xs:w-44 medium-16">
          <img src={listUser} alt="User List" height={50} width={50} />
          <span>User List</span> 
        </button>
      </Link>
    </div>
  );
}

export default Sidebar;