import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { MdCategory, MdContacts, MdHomeFilled, MdShop2 } from "react-icons/md";
import { ShopContext } from "../Context/ShopContext";

const Navbar = ({ containerStyles }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { all_products } = useContext(ShopContext);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      const results = all_products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <nav className={`${containerStyles}`}>
      <NavLink to={'/'} className={({isActive}) => isActive ? "active_link" : ""}>
        <div className="flexCenter gap-x-1"><MdHomeFilled />Home</div>
      </NavLink>
      {/* Search Box */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search products..."
          className="p-2 border border-gray-300 rounded"
        />
        {searchResults.length > 0 && (
          <div className="absolute bg-white border border-gray-300 rounded mt-1 w-full max-h-60 overflow-y-auto">
            {searchResults.map((product) => (
              <NavLink
                key={product.id}
                to={`/product/${product.id}`}
                className="block p-2 hover:bg-gray-100"
                onClick={() => setSearchResults([])}
              >
                {product.name}
              </NavLink>
            ))}
          </div>
        )}
      </div>
      <NavLink to={'/mens'} className={({isActive}) => isActive ? "active_link" : ""}>
        <div className="flexCenter gap-x-1"><MdCategory />Men's</div>
      </NavLink>
      <NavLink to={'/womens'} className={({isActive}) => isActive ? "active_link" : ""}>
        <div className="flexCenter gap-x-1"><MdShop2 />Women's</div>
      </NavLink>
      <NavLink to={'/kids'} className={({isActive}) => isActive ? "active_link" : ""}>
        <div className="flexCenter gap-x-1"><MdContacts />Kid's</div>
      </NavLink>
      
    </nav>
  );
};

export default Navbar;