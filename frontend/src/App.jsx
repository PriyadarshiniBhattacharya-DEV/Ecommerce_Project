import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/UserPages/LoginPage.jsx";
import Register from "./pages/UserPages/Register.jsx";
import Dashboard from "./pages/UserPages/Dashboard.jsx";
import CartPage from "./pages/UserPages/CartPage.jsx";
import CheckoutPage from "./pages/UserPages/CheckoutPage.jsx";
import ProductPage from "./pages/UserPages/ProductPage.jsx";
import CategoryPage from "./pages/UserPages/CategoryPage.jsx";
import WishlistPage from "./pages/UserPages/WishlistPage.jsx";
import SearchPage from "./pages/UserPages/SearchPage.jsx";
import AdminDashboard from "./pages/AdminPages/AdminDashboard.jsx";
import ShowUsersPage from "./pages/AdminPages/ShowUsersPage.jsx";
import ProductListPage from "./pages/AdminPages/ProductListPage.jsx";
import CategoryListPage from "./pages/AdminPages/CategoryListPage.jsx";
import Footer from "./components/Footer.jsx";
import SalesReport from "./pages/AdminPages/SalesReport.jsx";
import AddProductPage from "./pages/AdminPages/AddProductPage.jsx";
import AddCategoryPage from "./pages/AdminPages/AddCategoryPage.jsx";
import AdminLogin from "./pages/AdminPages/AdminLogin.jsx";
import UpdateProductPage from "./pages/AdminPages/UpdateProductPage.jsx";
import AdminOrderPage from "./pages/AdminPages/AdminOrderPage.jsx";
import OrdersPage from "./pages/UserPages/OrdersPage.jsx";
import OrderDetailsPage from "./pages/UserPages/OrderDetailsPage.jsx";
import ReturnRequestPage from "./pages/UserPages/ReturnRequestPage.jsx";
import UserCategoryPage from "./pages/UserPages/UserCategoryPage.jsx";
import UpdateCategoryPage from "./pages/AdminPages/UpdateCategoryPage.jsx";
import { useAuth } from "./Context/AuthContext.jsx";
import SavedAddressPage from "./pages/UserPages/SavedAddressPage.jsx";
import AdminOrderDetailsPage from "./pages/AdminPages/AdminOrderDetailsPage.jsx";


function App() {
  const { isLoggedIn, isAdminLoggedIn, setIsAdminLoggedIn } = useAuth();
  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} isAdminLoggedIn={isAdminLoggedIn} setIsAdminLoggedIn={setIsAdminLoggedIn}/>
      <div className="container-fluid px-5">
        <Routes>
          {/* Dashboard */}<Route path="/" element={ isAdminLoggedIn? <Navigate to="/admindash" replace />: <Dashboard isLoggedIn={isLoggedIn} />} />

          {/* Product Details */}<Route path="/product/:id/:name" element={ isAdminLoggedIn? <Navigate to="/admindash" replace />: <ProductPage isLoggedIn={isLoggedIn}/>} />

          {/* Category */}<Route path="/category/:categoryId" element={ isAdminLoggedIn? <Navigate to="/admindash" replace />: <CategoryPage />}/>

          {/* Search */}<Route path="/search/:keyword" element={ isAdminLoggedIn? <Navigate to="/admindash" replace />: <SearchPage />} />

          {/* Wishlist */}<Route path="/wishlist" element={ isAdminLoggedIn? <Navigate to="/admindash" replace />: <WishlistPage isLoggedIn={isLoggedIn}/>} />

          {/* Cart */}<Route path="/cart" element={ isAdminLoggedIn? <Navigate to="/admindash" replace />: <CartPage isLoggedIn={isLoggedIn} />} />

          {/* Login */}<Route path="/login" element={ isAdminLoggedIn? <Navigate to="/admindash" replace />: <LoginPage /> }/>

          {/* Register */}<Route path="/signup" element={ isAdminLoggedIn? <Navigate to="/admindash" replace />: <Register /> } />

          {/* 404 */}<Route path="*" element={ <div className="text-center mt-5"><h1>404</h1><p>Page Not Found</p></div>} />

          {/* Admin Dashboard*/}<Route path="/admindash" element={isAdminLoggedIn? <AdminDashboard /> : <Navigate to="/adminlogin" replace />}/>

          {/* Admin Userpage*/}<Route path="/users" element={isAdminLoggedIn? <ShowUsersPage/> : <Navigate to="/adminlogin" replace />}/>

          <Route path="/productlist" element={isAdminLoggedIn? <ProductListPage/> : <Navigate to="/adminlogin" replace />}/>

          <Route path="/sales" element={isAdminLoggedIn? <SalesReport/> : <Navigate to="/adminlogin" replace />}/>

          <Route path="/addProduct/:categoryId?" element={isAdminLoggedIn? <AddProductPage/> : <Navigate to="/adminlogin" replace />}/>
          <Route path="/addCategory" element={isAdminLoggedIn? <AddCategoryPage/> : <Navigate to="/adminlogin" replace />}/>
          
          <Route path="/adminlogin" element={isAdminLoggedIn? <Navigate to="/admindash" replace />: <AdminLogin setIsAdminLoggedIn={setIsAdminLoggedIn} />}/>
          <Route path="/updateProduct/:id/:name" element={isAdminLoggedIn? <UpdateProductPage /> : <Navigate to="/adminlogin" replace />}/>
          
          <Route path="admincategory/edit/:categoryid" element={isAdminLoggedIn? <UpdateCategoryPage/> : <Navigate to="/adminlogin" replace />}/>
          
          <Route path="/viewProduct/:id/:name" element={isAdminLoggedIn? <ProductPage isAdminLoggedIn={isAdminLoggedIn}/>: <Navigate to="/adminlogin" replace />} />

          <Route path="/adminorders" element={isAdminLoggedIn? <AdminOrderPage/> : <Navigate to="/adminlogin" replace />}/>
          <Route path="/admin/orders/:orderId" element={isAdminLoggedIn? <AdminOrderDetailsPage/> : <Navigate to="/adminlogin" replace />}/>
          <Route path="/orders" element={<OrdersPage isLoggedIn={isLoggedIn}/>} />
          <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
          <Route path="/orders/:orderId/return/:itemId" element={<ReturnRequestPage />} />

          <Route path="/admincategory" element={isAdminLoggedIn? <CategoryListPage isAdminLoggedIn={isAdminLoggedIn}/> : <Navigate to="/adminlogin" replace />}/>
          <Route path="/admincategory/:categoryId" element={isAdminLoggedIn ? <CategoryPage isAdminLoggedIn={isAdminLoggedIn}/> : <Navigate to="/adminlogin" replace />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="saved-addresses" element={<SavedAddressPage />} />
          {/* Category */}<Route path="/allcategories" element={ isAdminLoggedIn? <Navigate to="/admindash" replace />: <UserCategoryPage isLoggedIn={isLoggedIn} />} />
        </Routes>
        
      </div>
      <Footer/>
    </BrowserRouter>
  );
}
export default App;
