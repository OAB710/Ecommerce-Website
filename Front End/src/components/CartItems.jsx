import React, { useContext, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { TbTrash } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const CartItems = () => {
  const navigate = useNavigate();
  const {
    all_products,
    cartItems,
    removeFromCart,
    getTotalCartAmount,
    updateCartQuantity,
    applyCoupon,
    discount, // Thêm dòng này
  } = useContext(ShopContext);

  const [couponCode, setCouponCode] = useState("");

  if (!Array.isArray(all_products) || all_products.length === 0) {
    return <div>Loading...</div>;
  }

  if (Object.keys(cartItems).length === 0) {
    return (
      <div className="flexCenter">
        <h1 style={{ marginTop: "100px" }}>
          Your cart is empty.{" "}
          <span
            style={{ color: "#FF813F", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Fill cart to continue
          </span>
        </h1>
      </div>
    );
  }

  return (
    <section className="max_padd_container pt-28">
      <table className="w-full mx-auto">
        <thead>
          <tr>
            <th className="p-1 py-2">Products</th>
            <th className="p-1 py-2">Title</th>
            <th className="p-1 py-2">Price</th>
            <th className="p-1 py-2">Size</th>
            <th className="p-1 py-2">Color</th>
            <th className="p-1 py-2">Quantity</th>
            <th className="p-1 py-2">Remove</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(cartItems).map((key) => {
            if (cartItems[key] > 0) {
              const [productId, size, color] = key.split("_");
              const product = all_products.find((p) => p.id === productId);
              if (!product) return null;

              return (
                <tr
                  key={key}
                  className="border-b border-slate-900/20 text-gray-30 p-6 medium-14 text-center"
                >
                  <td className="flexCenter">
                    <img
                      src={product.image}
                      alt="prdctImg"
                      height={43}
                      width={43}
                      className="rounded-lg ring-1 ring-slate-900/5 my-1"
                    />
                  </td>
                  <td>
                    <div className="line-clamp-3">{product.name}</div>
                  </td>
                  <td>${product.new_price}</td>
                  <td>{size}</td>
                  <td>{color}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={cartItems[key]}
                      style={{
                        width: "50px",
                        padding: "5px",
                        backgroundColor: "#f1f1f1",
                      }}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value > 0) {
                          updateCartQuantity(productId, { size, color }, value);
                        } else if (
                          e.target.value === "" ||
                          e.target.value === "0"
                        ) {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this item?"
                            )
                          ) {
                            removeFromCart(
                              productId,
                              { size, color },
                              cartItems[key]
                            );
                          } else {
                            updateCartQuantity(
                              productId,
                              { size, color },
                              cartItems[key]
                            );
                          }
                        } else {
                          updateCartQuantity(productId, { size, color }, 1); // Set to default value if input is invalid
                        }
                      }}
                    />
                  </td>
                  <td>${(product.new_price * cartItems[key]).toFixed(2)}</td>
                  <td>
                    <div className="bold-22 pl-14">
                      <TbTrash
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this item?"
                            )
                          ) {
                            removeFromCart(
                              productId,
                              { size, color },
                              cartItems[key]
                            );
                          }
                        }}
                      />
                    </div>
                  </td>
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </table>

      <div
        className="max-w-6xl mx-auto p-4 bg-white shadow-md"
        style={{ marginTop: "20px" }}
      >
        <div className="flex flex-col md:flex-row justify-between">
          <div className="w-full md:w-1/2 p-4">
            <div
              className="flex flex-col gap-10"
              style={{ marginRight: "50px" }}
            >
              <h4 className="text-xl bold-20">SUMMARY</h4>
              <div>
                <div className="flexBetween py-4">
                  <h4 className="medium-16">Subtotal:</h4>
                  <h4 className="text-gray-30 font-semibold">
                    ${getTotalCartAmount()}
                  </h4>
                </div>
                <hr />
                <div className="flexBetween py-4">
                  <h4 className="medium-16">Shipping Fee:</h4>
                  <h4 className="text-gray-30 font-semibold">Free</h4>
                </div>
                <hr />
                {discount > 0 && ( // Thêm đoạn này
                  <>
                    <div className="flexBetween py-4">
                      <h4 className="medium-16">Discount:</h4>
                      <h4 className="text-gray-30 font-semibold">
                        ${discount}
                      </h4>
                    </div>
                    <hr />
                  </>
                )}
                <div className="flexBetween py-4">
                  <h4 className="bold-18">Total:</h4>
                  <h4 className="bold-18">
                    ${Math.max(0, getTotalCartAmount() - discount)}
                  </h4>
                </div>
              </div>
              <div className="flex flex-col gap-10">
                <h4 className="bold-20 capitalize">
                  Your coupon code enter here:
                </h4>
                <div className="flexBetween pl-5 h-12 bg-primary rounded-full ring-1 ring-slate-900/10">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="bg-transparent border-none outline-none"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    className="btn_dark_rounded"
                    onClick={() => applyCoupon(couponCode)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 p-4 bg-white">
            <h2 className="text-xl font-bold mb-4">ORDER DETAIL</h2>
            <form>
              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300"
                  value=""
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Contact</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300"
                  value=""
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">City</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300"
                  value=""
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Address</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300"
                  value=""
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Note</label>{" "}
                <textarea className="w-full p-2 border border-gray-300"></textarea>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Payment method</label>
                <div className="flex items-center mb-2">
                  <input type="radio" name="payment" className="mr-2" checked />
                  <label>Cash on Delivery (COD)</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" name="payment" className="mr-2" />
                  <label>Pay with MoMo wallet</label>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <button className="w-full md:w-auto bg-teal-500 text-white p-2 mb-2 md:mb-0 md:mr-2">
                  ORDER: DELIVERY AND CASH ON DELIVERY
                </button>
                <button
                  className="w-full md:w-auto bg-yellow-500 text-white p-2"
                  onClick={() => navigate("/")}
                >
                  NEED OTHER PRODUCTS? CHOOSE MORE...
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartItems;
