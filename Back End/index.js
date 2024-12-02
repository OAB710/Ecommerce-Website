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
const database = encodeURIComponent("estore");

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
  },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
  points: {
    type: Number,
    default: 0,
  },
  isBanned: {
    type: Boolean,
    default: false,
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
  },
  date: {
    type: Date,
    default: Date.now,
  },
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
  shippingAddress: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

app.post("/addproduct", async (req, res) => {
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
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
    variants: req.body.variants,
    date: req.body.date,
    available: req.body.available,
  });

  console.log(product);
  await product.save();
  console.log("Saved");

  res.json({
    success: true,
    name: req.body.name, 
  });
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
  let products = await Product.find({});
  console.log("All products fetched");
  res.send(products);
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
app.post('/signup', async (req, res) => {
  let check = await User.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ 
      success: false, 
      errors: "Existing user found with same email address" 
    });
  }

  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }

  const user = new User({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password, 
    cartData: cart,
  });

  await user.save();

  const data = {
    user: {
      id: user._id // Use user._id to access the user's ID
    }
  };
  
  const token = jwt.sign(data, 'secret_ecom'); 
  
  res.json({ success: true, token });
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

// creating endpoint for adding products in cartdata
app.post('/addtocart', fetchUser, async (req, res) => {
  let userData = await User.findOne({ _id: req.user.id });
  if (userData) {
    userData.cartData[req.body.itemId] += 1;
    await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.json("Added");
  } else {
    // Handle the case where no user is found
    res.status(404).json({ error: 'User not found' });
  }
});

// creating endpoint for removing cartData
app.post('/removefromcart', fetchUser, async (req, res) => {
  console.log("Removed", req.body.itemId);

  let userData = await User.findOne({ _id: req.user.id 
 });

  if (userData && userData.cartData) { // Check if userData and cartData exist
    if (userData.cartData[req.body.itemId] > 0) {
      userData.cartData[req.body.itemId] -= 1;
      await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    } 
    res.send("Removed"); 
 
  } else {
    // Handle the case where no user or cartData is found
    res.status(404).json({ error: 'User or cart data not found' });
  }

});

app.post('/getcart', fetchUser, async (req, res) => {
  console.log('Get cart');

  let userData = await User.findOne({ _id: req.user.id });

  if (userData && userData.cartData) { // Check if userData and cartData exist
    res.json(userData.cartData); 
  } else {
    // Handle the case where no user or cartData is found
    res.status(404).json({ error: 'User or cart data not found' }); 
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
      { new: true }
    );
    if (updatedUser) {
      res.json({ success: true, message: "User updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "An error occurred while updating the user" });
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
  try {
    const { page = 1, limit = 20, sort = 'desc', startDate, endDate } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const orders = await Order.find(query)
      .populate('user', 'name')
      .sort({ date: sort === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalOrders = await Order.countDocuments(query);

    res.json({ orders, totalOrders, totalPages: Math.ceil(totalOrders / limit) });
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

app.get('/dashboard-data', async (req, res) => {
  const totalProducts = await Product.countDocuments();
  res.json({
    totalProducts,
  });
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

app.post('/addcoupons', async (req, res) => {
  const { code, discount, expirationDate } = req.body;
  const coupon = new Coupons({ code, discount, expirationDate });
  try {
    await coupon.save();
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.post('/removecoupon', async (req, res) => {
  await Coupons.findOneAndDelete({ _id: req.body.id });
  console.log("Removed");

  res.json({
    success: true,
  });
});