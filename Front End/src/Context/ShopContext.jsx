import { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);

// const getDefaultCart = () => {
//   let cart = {};

//   for (let index = 0; index < 300 + 1; index++) {
//     cart[index] = 0;
//   }
//   return cart;
// };

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const [all_products, setAll_products] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/allproducts")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched products:", data.products); // Add this line
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
    }
  }, []);

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

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/removefromcart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_products.find(
          (product) => product.id === Number(item)
        );
        if (itemInfo) {
          const price =
            itemInfo.new_price !== undefined ? itemInfo.new_price : 0;
          totalAmount += price * cartItems[item];
        }
      }
    }
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

  const contextValue = {
    all_products,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
