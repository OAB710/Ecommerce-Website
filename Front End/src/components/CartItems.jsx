import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";
import { TbTrash } from "react-icons/tb";
import { useNavigate, useLocation } from "react-router-dom";

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
};

const CartItems = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    all_products,
    cartItems,
    removeFromCart,
    getTotalCartAmount,
    updateCartQuantity,
    applyCoupon,
    discount,
    user,
  } = useContext(ShopContext);

  const [couponCode, setCouponCode] = useState("");
  const [pointsDiscount, setPointsDiscount] = useState(0);
  const [points, setPoints] = useState("");
  const [orderDetails, setOrderDetails] = useState({
    name: user.name,
    email: user.email,
    LoyaltyPoints: user.LoyaltyPoints,
    contact: user.contact,
    address: user.address,
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    if (location.state) {
      setOrderDetails({
        name: location.state.name,
        contact: location.state.contact,
        address: location.state.address,
      });
    } else {
      // Fetch order details if not available in location.state
      fetch("http://localhost:4000/getorderdetails", {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setOrderDetails({
              name: data.name,
              contact: data.contact,
              address: data.address,
              email: data.email,
            });
          } else {
            console.error("Error fetching order details:", data.message);
          }
        })
        .catch((error) =>
          console.error("Error fetching order details:", error)
        );
    }
  }, [location.state]);

  const handleChooseDeliveryAddress = () => {
    navigate("/choosedeli", {
      state: {
        name: orderDetails.name,
        contact: orderDetails.contact,
        address: orderDetails.address,
      },
    });
  };

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

  const handleRedeemPoints = () => {
    const pointsValue = parseInt(points);
    if (isNaN(pointsValue) || pointsValue % 50 !== 0) {
      alert("Please enter a multiple of 50");
      return;
    }
    if (pointsValue > user.LoyaltyPoints) {
      alert("You do not have enough points.");
      return;
    }

    const discountAmount = (pointsValue / 50000) * 50000;
    alert("Points redeemed successfully!");
    setPointsDiscount(discountAmount);
    setPoints(""); // Clear the input field
  };

  // Front End/src/components/CartItems.jsx
  const handleOrder = async () => {
    navigate("/orders");
    const orderData = {
      products: Object.keys(cartItems).map((key) => {
        const [productId, size, color] = key.split("_");
        const product = all_products.find(
          (p) => p.id === Number(productId) || p.id === productId
        );
        return {
          product: productId,
          name: product.name,
          category: product.category,
          tags: product.tags,
          variants: { size, color },
          quantity: cartItems[key],
          price: product.new_price,
          shortDescription: product.shortDescription,
        };
      }),
      total: getTotalCartAmount() - discount - pointsDiscount,
      shippingAddress: orderDetails.address,
      paymentMethod: paymentMethod === "COD" ? "COD" : "Banking",
      name: orderDetails.name,
      phone: orderDetails.contact,
      email: user.email,
      note: orderDetails.note, // Add note field
      LoyaltyPoints: pointsDiscount / 1000, // Assuming 1 point = 1000 currency units
    };

    const response = await fetch("http://localhost:4000/addorder", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    if (data.success) {
      alert("Order placed successfully!");

      // Clear cart items in database
      await fetch("http://localhost:4000/clearcart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      });
      window.location.reload();
      setCartItems({}); // Clear cart items in state
    } else {
      alert("Failed to place order: " + data.message);
    }
  };

  const updateMainImage = (product, color) => {
    const variant = product.variants.find((variant) => variant.color === color);
    return variant ? variant.image : product.image;
  };

  return (
    <section className="max_padd_container pt-28 mt-2">
      <table className="w-full mx-auto mt-16" style={{ marginTop: "4.5rem" }}>
        <thead>
          <tr>
            <th className="p-1 py-2">Products</th>
            <th className="p-1 py-2">Title</th>
            <th className="p-1 py-2">Price</th>
            <th className="p-1 py-2">Size</th>
            <th className="p-1 py-2">Color</th>
            <th className="p-1 py-2">Quantity</th>
            <th className="p-1 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(cartItems).map((key) => {
            if (cartItems[key] > 0) {
              const [productId, size, color] = key.split("_");
              const product = all_products.find((p) => p.id === productId);
              if (!product) return null;

              const imageSrc = updateMainImage(product, color);

              return (
                <tr
                  key={key}
                  className="border-b border-slate-900/20 text-gray-30 p-6 medium-14 text-center"
                >
                  <td className="flexCenter">
                    <img
                      src={imageSrc}
                      alt="prdctImg"
                      height={43}
                      width={43}
                      className="rounded-lg ring-1 ring-slate-900/5 my-1"
                    />
                  </td>
                  <td>
                    <div className="line-clamp-3">{product.name}</div>
                  </td>
                  <td>{formatPrice(product.new_price)}</td> {/* Format the price */}
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
                  <td>{formatPrice(product.new_price * cartItems[key])}</td> {/* Format the total price */}
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
                    {formatPrice(getTotalCartAmount())}
                  </h4>
                </div>
                <hr />
                <div className="flexBetween py-4">
                  <h4 className="medium-16">Shipping Fee:</h4>

                  {getTotalCartAmount() > 399000 ? (
                    <h4 className="text-gray-30 font-semibold">
                      <span className="font-bold text-black mr-2">
                        Free Shipping{" "}
                      </span>{" "}
                      <span className="line-through">{formatPrice(20000)}</span>
                    </h4>
                  ) : (
                    <h4 className="text-gray-30 font-semibold">{formatPrice(20000)}</h4>
                  )}
                </div>
                <hr />
                {discount > 0 && (
                  <>
                    <div className="flexBetween py-4">
                      <h4 className="medium-16">Discount:</h4>
                      <h4 className="text-gray-30 font-semibold">
                        {formatPrice(discount)}
                      </h4>
                    </div>
                    <hr />
                  </>
                )}
                {pointsDiscount > 0 && (
                  <>
                    <div className="flexBetween py-4">
                      <h4 className="medium-16">Point Discount:</h4>
                      <h4 className="text-gray-30 font-semibold">
                        {formatPrice(pointsDiscount)}
                      </h4>
                    </div>
                    <hr />
                  </>
                )}
                <div className="flexBetween py-4">
                  <h4 className="bold-18">Total:</h4>
                  <h4 className="bold-18">
                    {formatPrice(Math.max(
                      0,
                      getTotalCartAmount() -
                        discount -
                        pointsDiscount +
                        (getTotalCartAmount() > 399000 ? 0 : 20000)
                    ))}{" "}
                    đ
                  </h4>
                </div>
              </div>
              <div className="-mt-10 flexBetween py-4 font-bold underline text-red-500">
                Free shipping nationwide with bills over 399,000 đ
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
              <div className="flex flex-col gap-10">
                <h4 className="bold-20">Redeem Points (50,000 Points / 50,000 đ)</h4>
                <h6 className="-mt-10 font-semibold">
                  The points must be a multiple of 50
                </h6>
                <div className="flexBetween pl-5 h-12 bg-primary rounded-full ring-1 ring-slate-900/10">
                  <input
                    type="text"
                    placeholder="Points"
                    className="bg-transparent border-none outline-none"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                  />
                  <button
                    className="btn_dark_rounded"
                    onClick={handleRedeemPoints}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 p-4 bg-white">
            <h2 className="text-xl font-bold mb-4">ORDER DETAIL</h2>
            <button
              className="mb-4 w-full h-10 text-white rounded
              bg-yellow-500 text-white"
              onClick={handleChooseDeliveryAddress}
              style={{ backgroundColor: "#292C27" }}
            >
              Choose Delivery Address
            </button>
            <form>
              <div className="mb-4">
                <label className="block mb-2">Name *</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300"
                  value={orderDetails.name}
                  onChange={(e) =>
                    setOrderDetails({ ...orderDetails, name: e.target.value })
                  }
                  required={true}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Loyalty Points *</label>
                <input
                  type="text"
                  className="w-full p-2 border text-red-500 border-gray-300"
                  value={user.LoyaltyPoints}
                  required={true}
                />
              </div>
                            <div className="mb-4">
                <label className="block mb-2">Email *</label>
                {localStorage.getItem("auth-token") ? (
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300"
                    value={user.email}
                    onChange={(e) =>
                      setOrderDetails({ ...orderDetails, email: e.target.value })
                    }
                    required={true}
                  />
                ) : (
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300"
                    onChange={(e) =>
                      setOrderDetails({ ...orderDetails, email: e.target.value })
                    }
                    required={true}
                  />
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-2">Contact *</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300"
                  value={orderDetails.contact}
                  onChange={(e) =>
                    setOrderDetails({
                      ...orderDetails,
                      contact: e.target.value,
                    })
                  }
                  required={true}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Address *</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300"
                  value={orderDetails.address}
                  onChange={(e) =>
                    setOrderDetails({
                      ...orderDetails,
                      address: e.target.value,
                    })
                  }
                  required={true}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Note</label>
                <textarea
                  className="w-full p-2 border border-gray-300"
                  value={orderDetails.note}
                  onChange={(e) =>
                    setOrderDetails({ ...orderDetails, note: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="mb-4">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                  />
                  <span className="ml-2">Cash on Delivery (COD)</span>
                </label>
              </div>
              <div className="mb-4">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Banking"
                    checked={paymentMethod === "Banking"}
                    onChange={() => setPaymentMethod("Banking")}
                  />
                  <span className="ml-2">Banking (Bank / Momo)</span>
                </label>
              </div>
              <div className="flex flex-col md:flex-row">
                <button
                  className="w-full md:w-auto bg-teal-500 text-white p-2 mb-2 md:mb-0 md:mr-2"
                  onClick={handleOrder}
                >
                  ORDER: DELIVERY TO THIS ADDRESS
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