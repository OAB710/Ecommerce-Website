import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import bannermens from "./assets/bannermens.png";
import bannerwomens from "./assets/bannerwomens.png";
import bannerkids from "./assets/bannerkids.png";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Kids from "./pages/Kids";
import Shop from "./pages/Shop"; // Import the Shop component
import Profile from "./pages/Profile"; // Import the Profile component
import ResetPassword from "./pages/ResetPassword"; // Import the ResetPassword component

export default function App() {
  return (
    <main className="bg-primary text-tertiary">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mens" element={<Category category="men" banner={bannermens} />} />
          <Route path="/womens" element={<Category category="women" banner={bannerwomens} />} />
          <Route path="/kids" element={<Category category="kid" banner={bannerkids} />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/kid" element={<Kids />} />
          <Route path="/shop" element={<Shop />} /> {/* Add the Shop route */}
          <Route path="/product" element={<Product />}>
            <Route path=":productId" element={<Product />} />
          </Route>
          <Route path="/cart-page" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} /> {/* Add the Profile route */}
          <Route path="/resetpassword/:token" element={<ResetPassword />} /> {/* Add the ResetPassword route */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </main>
  );
}