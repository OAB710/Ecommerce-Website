const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");

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
  res.send("Express App is running");
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
    type: Number,
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
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
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
  await Product.findOneAndDelete({ id: req.body.id }); 
  console.log("Removed");

  res.json({
    success: true,
    name: req.body.name,   

  });
});

app.get('/allproducts', async (req, res) => {
  let products = await Product.find({});
  console.log("All products fetched");
  res.send(products);
});

// Schema user model
const User = mongoose.model('User', {
  name: {
    type: String,
    required: true, // Thêm required để đảm bảo field này luôn có giá trị
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  addresses: [{ // Định nghĩa addresses là một mảng các object
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    _id: false
  }],
  phone: {
    type: String,   },
  loyaltyPoints: {
    type: Number,
    default: 0, //  Giá trị mặc định là 0
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  facebookId: {
    type: String,
    unique: true,
    spare:true,
  }
});

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
  
 try { 
  const { username, email, password, addresses, phone } = req.body; // Lấy dữ liệu từ req.body
  
  const user = new User({
    name: username,  // Make sure this matches your schema field name
    email: email,
    password: password,
    addresses: addresses,
    phone: phone,
  });
  console.log(user);
  await user.save();
   const data = {
    user: {
      id: user._id // Use user._id to access the user's ID
    }
  };
  
  const token = jwt.sign(data, 'secret_ecom'); 
  
  res.json({ success: true, token });  // await user.save();
    // res.status(201).json({ message: 'User created successfully' });
 } catch (error) {
  console.error('Error creating user:', error);
    res.status(500).json({ error: error});
 }

  

 
});
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
   
    // Case 1: Facebook login (only email is provided)
   

    // Case 2: Normal login (email and password are provided)
    if (email && password) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, errors: 'Invalid email or password' });
      }

      // Assuming bcrypt is used for password hashing
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, errors: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
      return res.json({ success: true, token });
    }

    // If neither condition is met, return an error
    res.status(400).json({ success: false, errors: 'Invalid login request' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, errors: 'Failed to log in' });
  }
});
app.post('/login1', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Case 1: Facebook login (only email is provided)
    if (email) {
      const user = await User.findOne({ email });
      if (user) {
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
        return res.json({ userExists: true, token });
      } else {
        return res.json({ userExists: false });
      }
    }

    // Case 2: Normal login (email and password are provided)
    

    // If neither condition is met, return an error
  
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, errors: 'Failed to log in' });
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
  userData.cartData[req.body.itemId] += 1;
  await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.json("Added");
});

// creating endpoint for removing cartData
app.post('/removefromcart', fetchUser, async (req, res) => {
  console.log("Removed", req.body.itemId);

  let userData = await User.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0)

    userData.cartData[req.body.itemId]   
 -= 1;
  await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });

  res.send("Removed");   

});

app.post('/getcart', fetchUser, async (req, res) => {
  console.log('Get cart');

  let userData = await User.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server is running on port " + port);
    
  }
});
