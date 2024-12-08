import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
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
import ResetPassword from "./pages/ResetPassword"; // Import the ResetPassword component
import Profile from "./pages/Profile";
import Order from "./pages/Order";
import Delivery from "./pages/Delivery";
import DeliveryDetail from "./pages/DeliveryDetail";
import AddDele from "./pages/AddDele";
import ChooseDeli from "./pages/ChooseDeli";
import VerifyOTP from './pages/VerifyOTP';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <main className="bg-primary text-tertiary">
      <BrowserRouter>
        <ScrollToTop />
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
          <Route path="/verifyotp" element={<VerifyOTP />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} /> {/* Add the ResetPassword route */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/delivery-detail/:index" element={<DeliveryDetail />} />
          <Route path="/adddele" element={<AddDele />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </main>
  );
}