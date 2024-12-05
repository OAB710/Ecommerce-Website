// import { createContext, useState, useEffect } from "react";

// export const ShopContext = createContext(null);

// // const getDefaultCart = () => {
// //   let cart = {};

// //   for (let index = 0; index < 300 + 1; index++) {
// //     cart[index] = 0;
// //   }
// //   return cart;
// // };

// const ShopContextProvider = (props) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [all_products, setAll_products] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:4000/allproducts")
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Fetched products:", data.products); // Add this line
//         setAll_products(data.products || []);
//       });

//     if (localStorage.getItem("auth-token")) {
//       fetch("http://localhost:4000/getcart", {
//         method: "POST",
//         headers: {
//           Accept: "application/form-data",
//           "auth-token": `${localStorage.getItem("auth-token")}`,
//           "Content-Type": "application/json",
//         },
//         body: "",
//       })
//         .then((response) => response.json())
//         .then((data) => setCartItems(data));
//     }
//   }, []);

//   const addToCart = (productId, variant, quantity = 1) => {
//     const cartKey = `${productId}_${variant.size}_${variant.color}`;
//     setCartItems((prev) => ({
//       ...prev,
//       [cartKey]: (prev[cartKey] || 0) + quantity,
//     }));

//     if (localStorage.getItem("auth-token")) {
//       fetch("http://localhost:4000/addtocart", {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "auth-token": localStorage.getItem("auth-token"),
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ productId, variant, quantity }),
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           console.log(data);
//           if (data.success) {
//             setCartItems(data.cartData);
//           }
//         });
//     }
//   };

//   // const removeFromCart = (itemId) => {
//   //   setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

//   //   if (localStorage.getItem("auth-token")) {
//   //     fetch("http://localhost:4000/removefromcart", {
//   //       method: "POST",
//   //       headers: {
//   //         Accept: "application/form-data",
//   //         "auth-token": `${localStorage.getItem("auth-token")}`,
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({ itemId: itemId }),
//   //     })
//   //       .then((response) => response.json())
//   //       .then((data) => console.log(data));
//   //   }
//   // };

//     const removeFromCart = (productId, variant, quantity = 1) => {
//     const cartKey = `${productId}_${variant.size}_${variant.color}`;
//     setCartItems((prev) => {
//       const updatedCartItems = { ...prev };
//       if (updatedCartItems[cartKey] > 0) {
//         updatedCartItems[cartKey] -= quantity;
//         if (updatedCartItems[cartKey] <= 0) {
//           delete updatedCartItems[cartKey];
//         }
//       }
//       return updatedCartItems;
//     });

//     if (localStorage.getItem("auth-token")) {
//       fetch("http://localhost:4000/removefromcart", {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "auth-token": localStorage.getItem("auth-token"),
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ productId, variant, quantity }),
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           console.log(data);
//           if (data.success) {
//             setCartItems(data.cartData);
//           }
//         });
//     }
//   };

//   const getTotalCartAmount = () => {
//     let totalAmount = 0;
//     for (const item in cartItems) {
//       if (cartItems[item] > 0) {
//         let itemInfo = all_products.find(
//           (product) => product.id === Number(item)
//         );
//         if (itemInfo) {
//           const price =
//             itemInfo.new_price !== undefined ? itemInfo.new_price : 0;
//           totalAmount += price * cartItems[item];
//         }
//       }
//     }
//     return totalAmount;
//   };

//   const getTotalCartItems = () => {
//     let totalItem = 0;
//     for (const item in cartItems) {
//       if (cartItems[item] > 0) {
//         totalItem += cartItems[item];
//       }
//     }
//     return totalItem;
//   };

//   const contextValue = {
//     all_products,
//     cartItems,
//     addToCart,
//     removeFromCart,
//     getTotalCartAmount,
//     getTotalCartItems,
//   };
//   return (
//     <ShopContext.Provider value={contextValue}>
//       {props.children}
//     </ShopContext.Provider>
//   );
// };

// export default ShopContextProvider;

import { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const [all_products, setAll_products] = useState([]);
  const [discount, setDiscount] = useState(0);

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
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
