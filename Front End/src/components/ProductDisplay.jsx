import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import product_rt_1 from "../assets/product_rt_1.png";
import product_rt_2 from "../assets/product_rt_2.png";
import product_rt_3 from "../assets/product_rt_3.png";
import product_rt_4 from "../assets/product_rt_4.png";
import { MdStar } from "react-icons/md";

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [remainingQuantity, setRemainingQuantity] = useState(null);
  const [reviews, setReviews] = useState([]);

  const { productId } = useParams();

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await fetch(`http://localhost:4000/reviews/${productId}`);
      const data = await response.json();
      setReviews(data);
    };

    fetchReviews();
  }, [productId]);

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
    updateRemainingQuantity(e.target.value, selectedSize);
  };

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
    updateRemainingQuantity(selectedColor, e.target.value);
  };

  const updateRemainingQuantity = (color, size) => {
    const variant = product.variants.find(
      (variant) => variant.color === color && variant.size === size
    );
    setRemainingQuantity(variant ? variant.quantity : null);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
  };

  const handleAddToCart = () => {
    if (selectedColor && selectedSize) {
      addToCart(product.id, selectedColor, selectedSize, quantity);
    } else {
      alert("Please select color and size.");
    }
  };

  return (
    <section>
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
            <img src={product.image} alt="" />
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
            <div className="line-through">{formatPrice(product.old_price)}</div>
            <div className="text-secondary">{formatPrice(product.new_price)}</div>
          </div>
          <div className="mb-4">
            <h4 className="bold-16">Select Color:</h4>
            <select
              value={selectedColor}
              onChange={handleColorChange}
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
              onChange={handleSizeChange}
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
          {remainingQuantity !== null && (
            <div className="mb-4">
              <h4 className="bold-16">Remaining Quantity:</h4>
              <p>{remainingQuantity}</p>
            </div>
          )}
          <div className="mb-4">
            <h4 className="bold-16">Quantity:</h4>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              max={remainingQuantity || 1}
              className="block w-full mt-1"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="btn_dark_rounded !rounded-none uppercase regular-14 tracking-widest"
            >
              Add to cart
            </button>
            <button className="btn_dark_rounded !rounded-none uppercase regular-14 tracking-widest">
              Buy it now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h4 className="bold-22 uppercase">Product Reviews</h4>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="border-b border-slate-900/20 py-4">
              <div className="flex items-center gap-2">
                <MdStar className="text-yellow-500" />
                <p className="bold-16">{review.user.name}</p>
              </div>
              <p className="medium-14">{review.review}</p>
              <div className="flex gap-2">
                {Array(review.rating)
                  .fill()
                  .map((_, i) => (
                    <MdStar key={i} className="text-yellow-500" />
                  ))}
              </div>
              <p className="text-gray-500 text-sm">{new Date(review.date).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </section>
  );
};

export default ProductDisplay;