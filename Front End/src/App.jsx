import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import bannermens from "./assets/bannermens.png"
import bannerwomens from "./assets/bannerwomens.png"
import bannerkids from "./assets/bannerkids.png"
import Admin from '../../admin/src/App'; 
import Navbar from "../../admin/src/components/Navbar";
import Sidebar from "../../admin/src/components/Sidebar";

export default function App() {
  return (
    <main className="bg-primary text-tertiary">
      <BrowserRouter>
        {window.location.pathname !== '/admin' && ( 
          <>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mens" element={<Category category="men" banner={bannermens} />}  />
              <Route path="/womens" element={<Category category="women" banner={bannerwomens} />} />
              <Route path="/kids" element={<Category category="kid" banner={bannerkids} />} />
              <Route path="/product" element={<Product />}>
                <Route path=":productId" element={<Product />} />
              </Route>
              <Route path="/cart-page" element={<Cart />} />
              <Route path="/login" element={<Login />} />
            </Routes>
            <Footer />
          </>
        )}
        
        <Routes>
        
        <Route path="/admin/*" element={<Admin />} className="py-7 flex justify-center gap-x-2 gap-y-5 w-full bg-white sm:gap-x-4 lg:flex-col lg:pt-20 lg:max-w-60 lg:h-screen lg:justify-start lg:pl-6"  />
        
        </Routes>
        
      </BrowserRouter>
      
    </main>
  );
}
