const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

// const redis = require("redis");
// const client = redis.createClient({
//   host: 'redis'
//   port: 6379
// });

const username = encodeURIComponent("binhquyen");
const password = encodeURIComponent("123");
const database = encodeURIComponent("estore1");

app.use(express.json());
app.use(cors());

// Connect to MongoDB. If we haven't created the database in mongodb.com yet, it will be created for us when we run this file.
mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.wjpjj.mongodb.net/${database}?retryWrites=true&w=majority&appName=Cluster0`
);

// Api creation
app.get("/", (req, res) => {
  const imageId = process.env.HOSTNAME || "not running in Docker"; // Giá trị mặc định nếu không có HOSTNAME
  res.send(`Express App is running. Container ID: ${imageId}`);
});

// Image storage engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
});

app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

const Product = mongoose.model("Product", {
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  variants: [
    {
      color: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        required: true,
        enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"], // Default sizes
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});
const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  addresses: [
    {
      name: {
        type: String,
        required: true,
      },
      contact: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
  ],
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
  LoyaltyPoints: {
    type: Number,
    default: 0,
  },
  LoyaltyTicker: {
    type: Number,
    default: 0,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  cartData: {
    type: Object,
    default: {},
  },
});
//Category
const Category = mongoose.model('Category', {
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
//review
const Review = mongoose.model('Review', {
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  review: {
    type: String,
    required: true,
  },
  rating: { 
    type: Number,
    required: true,
    min: 1, // Minimum value of 1
    max: 5, // Maximum value of 5
  },
  date: {
    type: Date,
    default: Date.now,
  },
  images: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length <= 4;
      },
      message: props => `A review can have a maximum of 4 images, but ${props.value.length} were provided.`
    }
  }
});
//cart
const Cart = mongoose.model('Cart', {
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
    },
  ],
  total: {
    type: Number,
    required: true,
  },
});
//coupon
const Coupon = mongoose.model('Coupon', {
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discountValue: {
    type: Number,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});
//order
const Order = mongoose.model('Order', {
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number,
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipping', 'delivered'],
    default: 'pending',
  },
  name: { type: String }, // Thêm dòng này
  phone: { type: String }, // Thêm dòng này
  shippingAddress: {
    type: String,
    required: true,
  },

  note: { type: String }, // Thêm dòng này
  
  paymentMethod: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});



app.post("/addproduct", async (req, res) => {
  const { name, image, category, new_price, old_price, variants, date, available } = req.body;

  if (!name || !image || !category || !new_price || !old_price) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  if (isNaN(new_price) || isNaN(old_price)) {
    return res.status(400).json({ success: false, message: "New price and old price must be numbers" });
  }

  let products = await Product.find({});
  let id;

  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1; 
  } else {
    id = 1;
  }

  const product = new Product({
    id: id,
    name: name,
    image: image,
    category: category,
    new_price: new_price,
    old_price: old_price,
    variants: variants,
    date: date,
    available: available,
  });

  try {
    await product.save();
    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "An error occurred while adding the product" });
  }
});
app.post('/removeproduct', async (req, res) => {
  try {
    const result = await Product.findOneAndDelete({ id: req.body.id });
    if (result) {
      console.log("Removed");
      res.json({
        success: true,
        message: "Product removed successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while removing the product",
    });
  }
});

app.get('/allproducts', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const products = await Product.find({})
      .skip(skip)
      .limit(Number(limit));
    const totalProducts = await Product.countDocuments();

    res.json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "An error occurred while fetching products" });
  }
});
// app.get('/allproducts', async (req, res) => {
//   const cacheKey = 'all_products';

//   
//   client.get(cacheKey, async (err, cachedData) => {
//     if (cachedData) {
//       
//       console.log("Fetched from Redis cache");
//       return res.send(JSON.parse(cachedData));
//     } else {
// 
//       let products = await Product.find({});
//       console.log("All products fetched from MongoDB");

//       Save data in Redis cache
//       client.setex(cacheKey, 3600, JSON.stringify(products));

//       res.send(products);
//     }
//   });
// });


// Schema user model
// const User = mongoose.model('User', {
//   name: {
//     type: String,
//   },
//   email: {
//     type: String,
//     unique: true,
//   },
//   password: {
//     type: String,
//   },
//   cartData: { 
//     type: Object,
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });

// Creating endpoint for registering the user
// app.post('/signup', async (req, res) => {
//   let check = await User.findOne({ email: req.body.email });
//   if (check) {
//     return res.status(400).json({ 
//       success: false, 
//       errors: "Existing user found with same email address" 
//     });
//   }

//   let cart = {};
//   for (let i = 0; i < 300; i++) {
//     cart[i] = 0;
//   }

//   const user = new User({
//     name: req.body.username,
//     email: req.body.email,
//     password: req.body.password, 
//     cartData: cart,
//   });

//   await user.save();

//   const data = {
//     user: {
//       id: user._id // Use user._id to access the user's ID
//     }
//   };
  
//   const token = jwt.sign(data, 'secret_ecom'); 
  
//   res.json({ success: true, token });
// });

app.post('/signup', async (req, res) => {
  try {
    // Kiểm tra xem email đã tồn tại chưa
    let check = await User.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({ 
        success: false, 
        errors: "Existing user found with same email address" 
      });
    }

    // Tạo người dùng mới với dữ liệu từ yêu cầu
    const user = new User({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      address: req.body.address,
      addresses: req.body.addresses || [], // Thêm trường addresses
      role: req.body.role || 'customer', // Mặc định là 'customer' nếu không có role
      LoyaltyPoints: req.body.LoyaltyPoints || 0,
      LoyaltyTicker: req.body.LoyaltyTicker || 0,
      isBanned: req.body.isBanned || false,
      cartData: {} // Khởi tạo cartData như một đối tượng rỗng
    });

    // Lưu người dùng mới vào cơ sở dữ liệu
    await user.save();

    // Tạo token JWT cho người dùng
    const data = {
      user: {
        id: user._id // Sử dụng user._id để truy cập ID của người dùng
      }
    };
    
    const token = jwt.sign(data, 'secret_ecom'); 
    
    // Trả về phản hồi thành công với token
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Creating endpoint for user login
app.post('/login', async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (user) {
    const passMatch = req.body.password === user.password; 
    if (passMatch) {
      const data = {
        user: {
          id: user._id // Use _id to get the user's ID
        }
      };

      const token = jwt.sign(data, 'secret_ecom');
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong Password" });
    }
  } else {
    res.json({ success: false, errors: "Wrong Email address" });
  }
});
app.get('/newcollections', async (req, res) => {
  const { category } = req.query;
  let query = {};
  if (category) {
    query.category = category;
  }
  let products = await Product.find(query).sort({ date: -1 }).limit(8);
  res.json(products);
});
// creating endpoint for latestproducts
app.get('/newcollections', async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8); 
  console.log("Newcollection Fetched");
  res.send(newcollection); 
});

// creating endpoint for popular products
app.get('/popularproducts', async (req, res) => {
  let products = await Product.find({ category: "men" }); // Corrected 'catrgory' to 'category'
  let popularproducts = products.slice(0, 4); 
  console.log("popular products Fetched");
  res.send(popularproducts); 
});
// Fetch product details
// Fetch product details
app.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: "An error occurred while fetching the product" });
  }
});

// Edit product details
app.post('/editproduct/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (updatedProduct) {
      res.json({ success: true, message: "Product updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "An error occurred while updating the product" });
  }
});

// creating middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using valid login" });
  } else {
    try {
      const data = jwt.verify(token, 'secret_ecom');
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
  }
};

app.get('/shipping-addresses', fetchUser, async (req, res) => {
  try {
    // Lấy userId từ token
    const userId = req.user.id;

    // Tìm người dùng theo userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Trả về danh sách địa chỉ giao hàng
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    console.error("Error fetching shipping addresses:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// creating endpoint for adding products in cartdata
// app.post('/addtocart', fetchUser, async (req, res) => {
//   let userData = await User.findOne({ _id: req.user.id });
//   if (userData) {
//     userData.cartData[req.body.itemId] += 1;
//     await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
//     res.json("Added");
//   } else {
//     // Handle the case where no user is found
//     res.status(404).json({ error: 'User not found' });
//   }
// });

app.post('/addtocart', fetchUser, async (req, res) => {
  const { productId, variant, quantity } = req.body;
  if (!productId || !variant || !quantity) {
    return res.status(400).json({
      success: false,
      message: "Product ID, variant, and quantity are required",
    });
  }

  try {
    const userData = await User.findById(req.user.id);
    if (userData) {
      if (!userData.cartData) {
        userData.cartData = {};
      }

      const cartKey = `${productId}_${variant.size}_${variant.color}`;
      // Ensure quantity is treated as a number
      const currentQuantity = Number(userData.cartData[cartKey] || 0);
      const newQuantity = Number(quantity);

      // Update the quantity directly
      userData.cartData[cartKey] = currentQuantity + newQuantity;

      userData.markModified('cartData');

      await userData.save();
      res.json({ success: true, message: "Added to cart", cartData: userData.cartData });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.post('/updatecartquantity', fetchUser, async (req, res) => {
  const { productId, variant, quantity } = req.body;
  if (!productId || !variant || !quantity) {
    return res.status(400).json({
      success: false,
      message: "Product ID, variant, and quantity are required",
    });
  }

  try {
    const userData = await User.findById(req.user.id);
    if (userData) {
      if (!userData.cartData) {
        userData.cartData = {};
      }

      const cartKey = `${productId}_${variant.size}_${variant.color}`;
      userData.cartData[cartKey] = quantity;

      userData.markModified('cartData');

      
      await userData.save();
      res.json({ success: true, message: "Cart quantity updated", cartData: userData.cartData });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// creating endpoint for removing cartData
// app.post('/removefromcart', fetchUser, async (req, res) => {
//   console.log("Removed", req.body.itemId);

//   let userData = await User.findOne({ _id: req.user.id 
//  });

//   if (userData && userData.cartData) { // Check if userData and cartData exist
//     if (userData.cartData[req.body.itemId] > 0) {
//       userData.cartData[req.body.itemId] -= 1;
//       await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
//     } 
//     res.send("Removed"); 
 
//   } else {
//     // Handle the case where no user or cartData is found
//     res.status(404).json({ error: 'User or cart data not found' });
//   }

// });

// app.post('/removefromcart', fetchUser, async (req, res) => {
//   const { productId, variant, quantity } = req.body;
//   if (!productId || !variant || !quantity) {
//     return res.status(400).json({ success: false, message: "Product ID, variant, and quantity are required" });
//   }

//   try {
//     const userData = await User.findOne({ _id: req.user.id });
//     if (userData && userData.cartData) {
//       const cartKey = `${productId}_${variant.size}_${variant.color}`;
//       if (userData.cartData[cartKey] && userData.cartData[cartKey] > 0) {
//         userData.cartData[cartKey] -= quantity;
//         if (userData.cartData[cartKey] <= 0) {
//           delete userData.cartData[cartKey];
//         }
//         await userData.save();
//         res.json({ success: true, message: "Removed from cart" });
//       } else {
//         res.status(400).json({ success: false, message: "Item not in cart or invalid quantity" });
//       }
//     } else {
//       res.status(404).json({ success: false, message: "User or cart data not found" });
//     }
//   } catch (error) {
//     console.error("Error removing from cart:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });

app.post('/removefromcart', fetchUser, async (req, res) => {
  const { productId, variant, quantity } = req.body;
  if (!productId || !variant || !quantity) {
    return res.status(400).json({ success: false, message: "Product ID, variant, and quantity are required" });
  }

  try {
    const userData = await User.findOne({ _id: req.user.id });
    if (userData && userData.cartData) {
      const cartKey = `${productId}_${variant.size}_${variant.color}`;
      if (userData.cartData[cartKey] && userData.cartData[cartKey] > 0) {
        userData.cartData[cartKey] -= quantity;
        if (userData.cartData[cartKey] <= 0) {
          delete userData.cartData[cartKey];
        }
        userData.markModified('cartData');
        await userData.save();
        res.json({ success: true, message: "Removed from cart", cartData: userData.cartData });
      } else {
        res.status(400).json({ success: false, message: "Item not in cart or invalid quantity" });
      }
    } else {
      res.status(404).json({ success: false, message: "User or cart data not found" });
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// app.post('/getcart', fetchUser, async (req, res) => {
//   console.log('Get cart');

//   let userData = await User.findOne({ _id: req.user.id });

//   if (userData && userData.cartData) { // Check if userData and cartData exist
//     res.json(userData.cartData); 
//   } else {
//     // Handle the case where no user or cartData is found
//     res.status(404).json({ error: 'User or cart data not found' }); 
//   }
// });

app.post('/getcart', fetchUser, async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.user.id });
    if (userData && userData.cartData) {
      res.json(userData.cartData);
    } else {
      res.status(404).json({ success: false, message: "User or cart data not found" });
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Fetch all users
app.get('/allusers', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "An error occurred while fetching users" });
  }
});
// Remove user
app.post('/removeuser', async (req, res) => {
  try {
    const result = await User.findOneAndDelete({ _id: req.body.id });
    if (result) {
      res.json({ success: true, message: "User removed successfully" });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error removing user:", error);
    res.status(500).json({ success: false, message: "An error occurred while removing the user" });
  }
});

// Fetch user details
app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "An error occurred while fetching the user" });
  }
});

// Edit user details
app.post('/edituser/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedUser) {
      res.json({ success: true, message: "User updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ success: false, message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` });
    } else {
      console.error("Error updating user:", error);
      res.status(500).json({ success: false, message: "An error occurred while updating the user" });
    }
  }
});

app.post('/addorder', async (req, res) => {
  try {
    const { products, total, shippingAddress, paymentMethod, name, phone, email } = req.body;
    let user;

    if (req.header('auth-token')) {
      // User is logged in
      const token = req.header('auth-token');
      const data = jwt.verify(token, 'secret_ecom');
      user = await User.findById(data.user.id);
    } else {
      // User is not logged in, create an account if it doesn't exist
      user = await User.findOne({ email });
      if (!user) {
        user = new User({
          name,
          email,
          password: Math.random().toString(36).slice(-8), // Generate a random password
          phone,
          address: shippingAddress,
        });
        await user.save();
      }
    }

    const order = new Order({
      user: user._id,
      products,
      total,
      shippingAddress,
      paymentMethod,
    });

    await order.save();
    res.json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "An error occurred while placing the order" });
  }
});

app.get('/allorders', async (req, res) => {
  const { page = 1, limit = 20, sort = 'desc', startDate, endDate } = req.query;
  const skip = (page - 1) * limit;
  const query = {};

  if (startDate && endDate) {
    query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  try {
    const orders = await Order.find(query)
      .populate('user', 'name')
      .sort({ date: sort === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(Number(limit));

    const totalOrders = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "An error occurred while fetching orders" });
  }
});
app.post('/updateorderstatus/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (updatedOrder) {
      res.json({ success: true, message: "Order status updated successfully", order: updatedOrder });
    } else {
      res.status(404).json({ success: false, message: "Order not found" });
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "An error occurred while updating the order status" });
  }
});

app.get('/order/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ success: false, message: "Order not found" });
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ success: false, message: "An error occurred while fetching the order" });
  }
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server is running on port " + port);
    
  }
});

app.post('/applycoupon', async (req, res) => {
  const { code } = req.body;

  try {
    const coupon = await Coupons.findOne({ code });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    const currentDate = new Date();
    if (currentDate > coupon.expirationDate) {
      return res.status(400).json({ success: false, message: "Coupon has expired" });
    }

    if (coupon.used) {
      return res.status(400).json({ success: false, message: "Coupon has already been used" });
    }

    res.json({ success: true, message: "Coupon is valid", discount: coupon.discount });
  } catch (error) {
    console.error("Error applying coupon:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Fetch user profile
app.get('/profile', fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
app.put('/profile', fetchUser, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, address },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete user account
app.delete('/profile', fetchUser, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/dashboard-data', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments({ date: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } });
    const totalOrders = await Order.countDocuments();
    const bestSellingProducts = await Order.aggregate([
      { $unwind: "$products" },
      { $group: { _id: "$products.product", totalSold: { $sum: "$products.quantity" } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      { $project: { _id: 1, totalSold: 1, name: "$product.name", image: "$product.image" } }
    ]);

    const productData = await Product.aggregate([
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json({
      totalProducts,
      totalUsers,
      newUsers,
      totalOrders,
      bestSellingProducts,
      productData
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ success: false, message: "An error occurred while fetching dashboard data" });
  }
});

const Coupons = mongoose.model('Coupons', {
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  creationTime: {
    type: Date,
    default: Date.now,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
});

app.get('/allcoupons', async (req, res) => {
  const coupons = await Coupons.find({});
  res.json(coupons);
});

app.get('/allcoupons', async (req, res) => {
  const coupons = await Coupons.find({});
  res.json(coupons);
});

app.post('/removecoupon', async (req, res) => {
  await Coupons.findOneAndDelete({ _id: req.body.id });
  console.log("Removed");

  res.json({
    success: true,
  });
});
app.get('/newcollections', async (req, res) => {
  const { category } = req.query;
  let query = {};
  if (category) {
    query.category = category;
  }
  let products = await Product.find(query).sort({ date: -1 }).limit(8);
  res.json(products);
});
app.post('/addcoupon', async (req, res) => {
  const { code, discount, expirationDate } = req.body;

  try {
    const newCoupon = new Coupons({
      code,
      discount,
      expirationDate,
    });

    await newCoupon.save();
    res.json({ success: true, message: "Coupon added successfully" });
  } catch (error) {
    console.error("Error adding coupon:", error);
    res.status(500).json({ success: false, message: "An error occurred while adding the coupon" });
  }
});
app.get('/revenue', async (req, res) => {
  const { year } = req.query;
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  try {
    const orders = await Order.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          totalRevenue: { $sum: "$total" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const revenueData = Array(12).fill(0);
    orders.forEach((order) => {
      revenueData[order._id - 1] = order.totalRevenue;
    });

    res.json(revenueData);
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res.status(500).json({ success: false, message: "An error occurred while fetching revenue data" });
  }
});

app.post('/add-address', fetchUser, async (req, res) => {
  try {
    const { name, contact, address } = req.body;

    if (!name || !contact || !address) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Tìm người dùng theo userId
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Thêm địa chỉ mới vào danh sách địa chỉ của người dùng
    user.addresses.push({ name, contact, address });
    await user.save();

    res.json({ success: true, message: "Address added successfully", addresses: user.addresses });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.delete('/delete-address/:index', fetchUser, async (req, res) => {
  try {
    const { index } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.addresses[index]) {
      user.addresses.splice(index, 1);
      await user.save();
      res.json({ success: true, message: "Address deleted successfully", addresses: user.addresses });
    } else {
      res.status(404).json({ success: false, message: "Address not found" });
    }
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.put('/update-address/:index', fetchUser, async (req, res) => {
  try {
    const { index } = req.params;
    const { name, contact, address } = req.body;

    // Tìm người dùng theo userId
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Cập nhật địa chỉ tại vị trí index
    if (user.addresses[index]) {
      user.addresses[index] = { name, contact, address };
      await user.save();
      res.json({ success: true, message: "Address updated successfully", addresses: user.addresses });
    } else {
      res.status(404).json({ success: false, message: "Address not found" });
    }
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get('/order-stats', async (req, res) => {
  const { year } = req.query;
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  try {
    const orders = await Order.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const orderData = Array(12).fill(0);
    orders.forEach((order) => {
      orderData[order._id - 1] = order.totalOrders;
    });

    res.json(orderData);
  } catch (error) {
    console.error("Error fetching order data:", error);
    res.status(500).json({ success: false, message: "An error occurred while fetching order data" });
  }
});
app.get('/reviews/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "An error occurred while fetching reviews" });
  }
});