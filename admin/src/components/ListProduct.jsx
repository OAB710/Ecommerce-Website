import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import upload_area from '../assets/addproduct.png';

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  const fetchInfo = async () => {
    await fetch('http://localhost:4000/allproducts')
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id) => {
    const response = await fetch('http://localhost:4000/removeproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    });
    const data = await response.json();
    console.log(data); // Log the response to verify success
    if (data.success) {
      await fetchInfo();
    } else {
      alert(data.message);
    }
  };

  const edit_product = (id) => {
    navigate(`/editproduct/${id}`);
  };

  const calculateTotalQuantity = (variants) => {
    return variants.reduce((total, variant) => total + variant.quantity, 0);
  };

  return (
    <div className="p-2 box-border bg-white mb-6 rounded-sm w-full mt-4 sm:p-4 sm:m-7">
      <div className="flex justify-between items-center p-5">
        <h4 className="bold-22 uppercase">Products List</h4>
        <Link to="/addproduct">
          <button className="flexCenter gap-2 rounded-md bg-primary h-12 w-44 xs:w-44 medium-16">
            <img src={upload_area} alt="Upload Area" className="h-6 w-6" />
            <span>Add Product</span>
          </button>
        </Link>
      </div>

      <div className="max-h-[77vh] overflow-auto px-4 text-center">
        <table className="w-full mx-auto">
          <thead>
            <tr className="bg-primary bold-14 sm:regular-22 text-start py-12">
              <th className="p-2">Products</th>
              <th className="p-2">Title</th>
              <th className="p-2">Old Price</th>
              <th className="p-2">New Price</th>
              <th className="p-2">Category</th>
              <th className="p-2">Size</th>
              <th className="p-2">Color</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Date</th>
              <th className="p-2">Available</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {allProducts.map((product, i) => (
              <tr key={i} className="border-b border-slate-900/20 text-gray-20 p-6 medium-14" style={{ height: '3em' }}>
                <td className="flexStart sm:flexCenter">
                  <img
                    src={product.image}
                    alt=""
                    height={43}
                    width={43}
                    className="rounded-lg ring-1 ring-slate-900/5 my-1"
                  />
                </td>
                <td>
                  <div className="line-clamp-3">{product.name}</div>
                </td>
                <td>${product.old_price}</td>
                <td>${product.new_price}</td>
                <td>{product.category}</td>
                <td>{product.variants.map(variant => variant.size).join(', ')}</td>
                <td>{product.variants.map(variant => variant.color).join(', ')}</td>
                <td>{calculateTotalQuantity(product.variants)}</td>
                <td>{new Date(product.date).toLocaleDateString()}</td>
                <td>{product.available ? "Yes" : "No"}</td>
                <td>
                  <button
                    onClick={() => edit_product(product.id)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove_product(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListProduct;