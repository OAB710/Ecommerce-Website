import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(ShopContext);

  useEffect(() => {
    // Fetch product details
    const fetchProductDetails = async () => {
      const response = await fetch(`http://localhost:4000/product/${productId}`);
      const data = await response.json();
      setProduct(data);
    };

    fetchProductDetails();
  }, [productId]);

  if (!product) {
    return <div>Product not found!</div>;
  }

  return (
    <section className="max_padd_container py-28">
      <div>
        <div className="product-header">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl text-gray-500">{product.category}</p>
        </div>
        <div className="product-display">
          <img src={product.image} alt={product.name} className="w-full h-auto" />
          <div className="product-pricing">
            <p className="text-2xl font-bold">${product.new_price}</p>
            <p className="text-xl text-gray-500 line-through">${product.old_price}</p>
          </div>
          <button
            onClick={() => addToCart(product.id)}
            className="btn_add_to_cart mt-4"
          >
            Add to Cart
          </button>
        </div>
        <div className="product-description">
          <h2 className="text-2xl font-bold">Description</h2>
          <p>{product.description}</p>
        </div>
        <div className="product-variants">
          <h2 className="text-2xl font-bold">Variants</h2>
          <div>
            <p><strong>Sizes:</strong> {product.variants.map(variant => variant.size).join(', ')}</p>
            <p><strong>Colors:</strong> {product.variants.map(variant => variant.color).join(', ')}</p>
            <p><strong>Available:</strong> {product.available ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;