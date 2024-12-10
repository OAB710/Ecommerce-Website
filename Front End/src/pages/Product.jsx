import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { MdStar } from "react-icons/md";
import Review from "../components/Review"; // Ensure Review component is imported
import {useNavigate} from 'react-router-dom';

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(ShopContext);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [remainingQuantity, setRemainingQuantity] = useState(null);
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
  };

  useEffect(() => {
    // Fetch product details
    const fetchProductDetails = async () => {
      const response = await fetch(
        `http://localhost:4000/product/${productId}`
      );
      const data = await response.json();
      setProduct(data);
      setMainImage(data.image); // Set the main image to the product's default image

      // Set initial selected color and size based on the first variant
      if (data.variants.length > 0) {
        setSelectedColor(data.variants[0].color);
        setSelectedSize(data.variants[0].size);
        setMainImage(data.variants[0].image);
        setRemainingQuantity(data.variants[0].quantity);
      }
    };

    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    if (remainingQuantity === 0) {
      setQuantity(0);
    }
  }, [remainingQuantity]);

  if (!product) {
    return <div>Product not found!</div>;
  }

  const handleAddToCart = () => {
    if (selectedColor && selectedSize) {
      const variant = { size: selectedSize, color: selectedColor };
      addToCart(product.id, variant, quantity);
    } else {
      alert("Please select color and size.");
    }
  };

  const buyitnow = () => {
    if (selectedColor && selectedSize) {
      const variant = { size: selectedSize, color: selectedColor };
      addToCart(product.id, variant, quantity);
      navigate('/cart-page');
    } else {
      alert("Please select color and size.");
    }
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    setSelectedColor(color);
    updateMainImage(color);
    updateRemainingQuantity(color, selectedSize);
  };

  const handleSizeChange = (e) => {
    const size = e.target.value;
    setSelectedSize(size);
    updateRemainingQuantity(selectedColor, size);
  };

  const updateMainImage = (color) => {
    const variant = product.variants.find((variant) => variant.color === color);
    if (variant) {
      setMainImage(variant.image);
    } else {
      setMainImage(product.image);
    }
  };

  const updateRemainingQuantity = (color, size) => {
    const variant = product.variants.find(
      (variant) => variant.color === color && variant.size === size
    );
    setRemainingQuantity(variant ? variant.quantity : null);
  };

  // Get unique colors and sizes
  const uniqueColors = [...new Set(product.variants.map(variant => variant.color))];
  const uniqueSizes = [...new Set(product.variants.map(variant => variant.size))];

  return (
    <section className="max_padd_container py-28" style={{ marginTop: '80px' }}>
      <div>
        <div className="flex flex-col gap-14 xl:flex-row">
          {/* left side */}
          <div className="flex gap-x-2 xl:flex-1">
            <div className="flex flex-col gap-[7px] flex-wrap">

            </div>
            <div>
              <img
                src={mainImage}
                alt={product.name}
                style={{ width: "416.9px", height: "400px" }}
                className="w-full h-auto max-h-full"
              />
            </div>
          </div>

          {/* right side */}
          <div className="flex-col flex xl:flex-[1.7]">
            <h3 className="h3">{product.name}</h3>
            <div className="flex gap-x-2 text-secondary medium-22">
            </div>
            <div className="flex gap-x-6 medium-20 my-4">
              <div className="line-through">
                {formatPrice(product.old_price)}
              </div>
              <div className="text-secondary">
                {formatPrice(product.new_price)}
              </div>
            </div>
            <div className="mb-4 flex items-center gap-4">
              <h4 className="bold-16">Select Color:</h4>
              <select
                value={selectedColor}
                onChange={handleColorChange}
                className="block w-full mt-1"
              >
                {uniqueColors.map((color, index) => (
                  <option key={index} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 flex items-center gap-4">
              <h4 className="bold-16">Select Size:</h4>
              <select
                value={selectedSize}
                onChange={handleSizeChange}
                className="block w-full mt-1"
              >
                {uniqueSizes.map((size, index) => (
                  <option key={index} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            {remainingQuantity !== null ? (
              <div className="mb-4">
                <h4 className="bold-16">Remaining Quantity:</h4>
                <p className={remainingQuantity === 0 ? "text-red-500 font-bold" : ""}>
                  {remainingQuantity === 0 ? "Out of Stock" : remainingQuantity}
                </p>
              </div>
            ) : (
              <div className="mb-4">
                <h4 className="bold-16">Remaining Quantity:</h4>
                <p className="text-red-500 font-bold">Out of Stock</p>
              </div>
            )}
            <div className="mb-4">
              <h4 className="bold-16">Quantity:</h4>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.min(e.target.value, remainingQuantity))}
                min="0"
                max={remainingQuantity || 0}
                className="block w-full mt-1"
                disabled={remainingQuantity === 0}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="btn_dark_rounded !rounded-none uppercase regular-14 tracking-widest"
                disabled={remainingQuantity === 0 || remainingQuantity === null}
              >
                Add to cart
              </button>
              <button
                onClick={buyitnow}
                className="btn_dark_rounded !rounded-none uppercase regular-14 tracking-widest"
                disabled={remainingQuantity === 0 || remainingQuantity === null}
              >
                Buy it now
              </button>
            </div>
            <p>
              <span className="medium-16 text-tertiary">Category:</span>{" "}
              {product.category}
            </p>
            <p>
              <span className="medium-16 text-tertiary">Tags:</span> {product.tags}
            </p>
          </div>
        </div>
        {/* Reviews Section */}
        <div className="mt-10">
          <Review productId={productId} /> {/* Add the Review component */}
        </div>
      </div>
    </section>
  );
};

export default Product;