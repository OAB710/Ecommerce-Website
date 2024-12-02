import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard"; // Ensure this path is correct
import bannermens from "../assets/bannermens.png";

export default function Men() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products?category=men&limit=4")
      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div>
      <img src={bannermens} alt="Men's Banner" />
      <h1>Men's Products</h1>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}