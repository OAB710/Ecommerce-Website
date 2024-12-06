
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Shop.css"; // Ensure the correct path to your CSS file

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, category, sort, page]);

  const fetchProducts = async () => {
    const response = await fetch(
      `http://localhost:4000/products?search=${searchTerm}&category=${category}&sort=${sort}&page=${page}`
    );
    const data = await response.json();
    setProducts(data.products);
    setTotalPages(data.totalPages);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="shop-container">
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <select value={category} onChange={handleCategoryChange} className="category-select">
          <option value="">All Categories</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
        <select value={sort} onChange={handleSortChange} className="sort-select">
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="relevance">Relevance</option>
        </select>
      </div>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.new_price}</p>
            <p className="product-description">{product.shortDescription}</p>
            <Link to={`/product/${product.id}`} className="product-link">View Details</Link>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`page-button ${page === index + 1 ? "active" : ""}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Shop;