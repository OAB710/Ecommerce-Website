import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard"; // Ensure this path is correct
import bannerwomens from "../assets/bannerwomens.png";

export default function Women() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products?category=women&limit=4")
      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div>
      <img src={bannerwomens} alt="Women's Banner" />
      <h1>Women's Products</h1>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}