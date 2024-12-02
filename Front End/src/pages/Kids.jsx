import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import bannerkids from "../assets/bannerkids.png"; // Ensure this path is correct

export default function Kids() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products?category=kid&limit=4")
      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div>
      <img src={bannerkids} alt="Kids' Banner" />
      <h1>Kids' Products</h1>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}