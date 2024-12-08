import { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const [all_products, setAll_products] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [user, setUser] = useState({ name: "", email: "", LoyaltyPoints: "", contact: "", address: "" });

  useEffect(() => {
    fetch("http://localhost:4000/allproducts")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched products:", data.products);
        setAll_products(data.products || []);
      });

    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/getcart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: "",
      })
        .then((response) => response.json())
        .then((data) => setCartItems(data));

      fetch("http://localhost:4000/profile", {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched profile data:", data);
          if (data) {
            setUser({
              name: data.name,
              email: data.email,
              LoyaltyPoints: data.LoyaltyPoints,
              contact: data.phone,
              address: data.address,
            });
          }
        })
        .catch((error) => console.error("Error fetching profile:", error));
    }
  }, []);

  const applyCoupon = (code) => {
    fetch("http://localhost:4000/applycoupon", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setDiscount(data.discount);
          alert("Coupon applied successfully!");
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error applying coupon:", error);
        alert("An error occurred while applying the coupon.");
      });
  };

  const addToCart = (productId, variant, quantity = 1) => {
    const cartKey = `${productId}_${variant.size}_${variant.color}`;
    setCartItems((prev) => ({
      ...prev,
      [cartKey]: (prev[cartKey] || 0) + quantity,
    }));

    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/addtocart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, variant, quantity }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.success) {
            setCartItems(data.cartData);
          }
        });
    }
  };

  const removeFromCart = (productId, variant, quantity = 1) => {
    const cartKey = `${productId}_${variant.size}_${variant.color}`;
    setCartItems((prev) => {
      const updatedCartItems = { ...prev };
      if (updatedCartItems[cartKey] > 0) {
        updatedCartItems[cartKey] -= quantity;
        if (updatedCartItems[cartKey] <= 0) {
          delete updatedCartItems[cartKey];
        }
      }
      return updatedCartItems;
    });

    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/removefromcart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, variant, quantity }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.success) {
            setCartItems(data.cartData);
          }
        });
    }
  };

  const updateCartQuantity = (productId, variant, quantity) => {
    const cartKey = `${productId}_${variant.size}_${variant.color}`;
    setCartItems((prev) => ({
      ...prev,
      [cartKey]: quantity,
    }));

    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/updatecartquantity", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, variant, quantity }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.success) {
            setCartItems(data.cartData);
          }
        });
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_products.find(
          (product) => product.id === item.split("_")[0]
        );
        console.log("Item info:", itemInfo);
        if (itemInfo) {
          const price =
            itemInfo.new_price !== undefined ? itemInfo.new_price : 0;
          totalAmount += price * cartItems[item];
        }
      }
    }
    console.log("Total amount:", totalAmount);
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const calculateLoyaltyPoints = (totalAmount) => {
    return Math.floor(totalAmount * 0.05);
  };

  const placeOrder = () => {
    const totalAmount = getTotalCartAmount();
    const loyaltyPoints = calculateLoyaltyPoints(totalAmount);

    fetch("http://localhost:4000/placeorder", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "auth-token": localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItems, totalAmount, loyaltyPoints }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Order placed successfully!");
          setCartItems([]);
          setUser((prevUser) => ({
            ...prevUser,
            LoyaltyPoints: prevUser.LoyaltyPoints + loyaltyPoints,
          }));
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        alert("An error occurred while placing the order.");
      });
  };

  const contextValue = {
    all_products,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getTotalCartAmount,
    getTotalCartItems,
    applyCoupon,
    discount,
    user,
    placeOrder,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;