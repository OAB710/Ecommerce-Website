import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(ShopContext);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

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

  const handleAddToCart = () => {
    if (selectedColor && selectedSize) {
      addToCart(product.id, selectedColor, selectedSize, quantity);
    } else {
      alert("Please select color and size.");
    }
  };

  return (
    <section className="max_padd_container py-28">
      <div className="group-box border p-4 mx-auto" style={{ width: "60%", maxHeight: "80vh", overflow: "auto" }}>
        <div className="flex">
          <div className="w-1/2">
            <img src={product.image} alt={product.name} className="w-full h-auto max-h-full" />
          </div>
          <div className="w-1/2 pl-8">
            <div className="product-header">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-xl text-gray-500">{product.category}</p>
            </div>
            <div className="product-pricing">
              <p className="text-2xl font-bold">${product.new_price}</p>
              <p className="text-xl text-gray-500 line-through">${product.old_price}</p>
            </div>
            <div className="product-variants mt-4">
              <label className="block mb-2">
                <span className="text-xl font-bold">Color:</span>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="block w-full mt-1"
                >
                  <option value="">Select Color</option>
                  {product.variants.map((variant, index) => (
                    <option key={index} value={variant.color}>
                      {variant.color}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block mb-2">
                <span className="text-xl font-bold">Size:</span>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="block w-full mt-1"
                >
                  <option value="">Select Size</option>
                  {product.variants.map((variant, index) => (
                    <option key={index} value={variant.size}>
                      {variant.size}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block mb-4">
                <span className="text-xl font-bold">Quantity:</span>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  className="block w-full mt-1"
                />
              </label>
              <button
                onClick={handleAddToCart}
                className="btn_add_to_cart mt-4"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;