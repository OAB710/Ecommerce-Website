import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import product_rt_1 from "../assets/product_rt_1.png";
import product_rt_2 from "../assets/product_rt_2.png";
import product_rt_3 from "../assets/product_rt_3.png";
import product_rt_4 from "../assets/product_rt_4.png";
import { MdStar } from "react-icons/md";

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
      <div >
        <div className="flex flex-col gap-14 xl:flex-row">
          {/* left side */}
          <div className="flex gap-x-2 xl:flex-1">
            <div className="flex flex-col gap-[7px] flex-wrap">
              <img src={product_rt_1} alt="productImg" className="max-h-[99px]" />
              <img src={product_rt_2} alt="productImg" className="max-h-[99px]" />
              <img src={product_rt_3} alt="productImg" className="max-h-[99px]" />
              <img src={product_rt_4} alt="productImg" className="max-h-[99px]" />
            </div>
            <div>
              <img src={product.image} alt={product.name} style={{ width: '400px', height: '400px' }} className="w-full h-auto max-h-full" />
            </div>
          </div>
          
          {/* right side */}
          <div className="flex-col flex xl:flex-[1.7]">
            <h3 className="h3">{product.name}</h3>
            <div className="flex gap-x-2 text-secondary medium-22">
              <MdStar />
              <MdStar />
              <MdStar />
              <MdStar />
              <p>(111)</p>
            </div>
            <div className="flex gap-x-6 medium-20 my-4">
              <div className="line-through">${product.old_price}</div>
              <div className="text-secondary">${product.new_price}</div>
            </div>
            <div className="mb-4">
              <h4 className="bold-16">Select Color:</h4>
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
            </div>
            <div className="mb-4">
              <h4 className="bold-16">Select Size:</h4>
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
            </div>
            <div className="mb-4">
              <h4 className="bold-16">Quantity:</h4>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                className="block w-full mt-1"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleAddToCart} className="btn_dark_rounded !rounded-none uppercase regular-14 tracking-widest">
                Add to cart
              </button>
              <button className="btn_dark_rounded !rounded-none uppercase regular-14 tracking-widest">
                Buy it now
              </button>
            </div>
            <p><span className="medium-16 text-tertiary">Category:</span> {product.category}</p>
            <p><span className="medium-16 text-tertiary">Tags:</span> Modern | Latest</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;