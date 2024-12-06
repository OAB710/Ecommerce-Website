import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchTags();
  }, [page, searchQuery, selectedCategory, selectedTag, sortOrder]);

  const fetchProducts = async () => {
    const query = new URLSearchParams({
      page,
      search: searchQuery,
      category: selectedCategory,
      tag: selectedTag,
      sort: sortOrder,
    }).toString();
    const response = await fetch(`http://localhost:4000/products?${query}`);
    const data = await response.json();
    setProducts(data.products);
    setTotalPages(data.totalPages);
  };

  const fetchCategories = async () => {
    const response = await fetch("http://localhost:4000/categories");
    const data = await response.json();
    setCategories(data);
  };

  const fetchTags = async () => {
    const response = await fetch("http://localhost:4000/tags");
    const data = await response.json();
    setTags(data);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setPage(1);
  };

  return (
    <div className="shop-page">
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select value={selectedTag} onChange={handleTagChange}>
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <select value={sortOrder} onChange={handleSortChange}>
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="relevance">Relevance</option>
        </select>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Shop;