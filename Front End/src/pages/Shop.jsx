import React, { useState, useEffect } from "react";
import Item from "../components/Item";
import { useSearchParams } from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000000);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchTags();
  }, [page, searchQuery, selectedCategory, selectedTags, sortOrder, minPrice, maxPrice]);

  const fetchProducts = async () => {
    try {
      const query = new URLSearchParams({
        page,
        search: searchQuery,
        category: selectedCategory,
        tags: selectedTags.join(","),
        minPrice,
        maxPrice,
        sort: sortOrder,
        limit: 4, // Limit to 4 products per page
      }).toString();
      const response = await fetch(`http://localhost:4000/products?${query}`);
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.statusText}`);
      }
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:4000/categories");
      if (!response.ok) {
        throw new Error(`Error fetching categories: ${response.statusText}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch("http://localhost:4000/tags");
      if (!response.ok) {
        throw new Error(`Error fetching tags: ${response.statusText}`);
      }
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
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
    const value = e.target.value;
    setSelectedTags(value ? [value] : []);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setPage(1);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
    setPage(1);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
    setPage(1);
  };

  return (
    <div className="shop-page flex mt-16"> {/* Added margin-top */}
      <div className="w-1/4 p-4 bg-gray-100">
        <h3 className="mb-4">Search by Name</h3>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <h3 className="mb-4">Filter by Category</h3>
        <select value={selectedCategory} onChange={handleCategoryChange} className="w-full p-2 border border-gray-300 rounded mt-2">
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <h3 className="mb-4">Filter by Tag</h3>
        <select value={selectedTags[0] || ""} onChange={handleTagChange} className="w-full p-2 border border-gray-300 rounded mt-2">
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <h3 className="mb-4">Sort By price</h3>
        <select value={sortOrder} onChange={handleSortChange} className="w-full p-2 border border-gray-300 rounded mt-2">
          <option value="">Sort By Price</option>
          <option value="price-asc"> Low to High</option>
          <option value="price-desc"> High to Low</option>
        </select>
      </div>
      <div className="w-3/4 p-4">
        <div className="product-list grid grid-col-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((item) => {
            const representativeVariant = item.variants[0]; // Select the first variant as the representative
            return (
              <Item
                key={item.id}
                id={item.id}
                image={representativeVariant.image}
                name={item.name}
                new_price={item.new_price}
                old_price={item.old_price}
                color={representativeVariant.color}
                shortDescription={item.shortDescription}
                tags={item.tags}
              />
            );
          })}
        </div>
        <div className="pagination mt-4 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`page-button ${page === index + 1 ? "active" : ""} p-2 border rounded`}
              style={{ fontSize: '1.25rem', margin: '0 0.5rem',  backgroundColor: '#FF813F', color: 'white' }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;