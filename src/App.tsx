import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
//import Navbar from './components/layout/Navbar';
// import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Public and customer
import HomePage from './pages/customer/HomePage';
import ProductListPage from './pages/customer/ProductListPage';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

import ProductDetailsPage from './pages/customer/ProductDetailsPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import CustomerOrdersPage from './pages/customer/CustomerOrdersPage';
import CustomerOrderDetailsPage from './pages/customer/CustomerOrderDetailsPage';
//import ProfilePage from './pages/customer/ProfilePage';
//import AddressesPage from './pages/customer/AddressesPage';
//import NotFoundPage from './pages/customer/NotFoundPage';

// Seller
//import SellerApplicationPage from './pages/seller/SellerApplicationPage';
//import SellerApplicationStatusPage from './pages/seller/SellerApplicationStatusPage';
//import SellerDashboardPage from './pages/seller/SellerDashboardPage';
//import SellerStorePage from './pages/seller/SellerStorePage';
import SellerProductsPage from './pages/seller/SellerProductsPage';
import AddProductPage from './pages/seller/AddProductPage';
import EditProductPage from './pages/seller/EditProductPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
//import SellerOrderDetailsPage from './pages/seller/SellerOrderDetailsPage';
//import SellerSalesPage from './pages/seller/SellerSalesPage';

// Admin
// import AdminDashboardPage from './pages/admin/AdminDashboardPage';
// import AdminCustomersPage from './pages/admin/AdminCustomersPage';
// import AdminSellersPage from './pages/admin/AdminSellersPage';
import AdminSellerApplicationsPage from './pages/admin/AdminSellerApplicationsPage';
//import PaymentResultPage from './pages/customer/PaymentResultPage';
// import AdminProductsPage from './pages/admin/AdminProductsPage';
// import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
// import AdminOrdersPage from './pages/admin/AdminOrdersPage';
// import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
// import AdminRefundsPage from './pages/admin/AdminRefundsPage';
// import AdminReviewsPage from './pages/admin/AdminReviewsPage';

function App() {
  
  return (
    <BrowserRouter>
  
      
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />

          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          {/* <Route path="/payment-result" element={<ProtectedRoute><PaymentResultPage /></ProtectedRoute>} /> */}
          <Route path="/orders" element={<ProtectedRoute><CustomerOrdersPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><CustomerOrderDetailsPage /></ProtectedRoute>} />

          <Route path="/seller/products" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerProductsPage /></ProtectedRoute>} />
          <Route path="/seller/products/new" element={<ProtectedRoute allowedRoles={['SELLER']}><AddProductPage /></ProtectedRoute>} />
          <Route path="/seller/products/:id/edit" element={<ProtectedRoute allowedRoles={['SELLER']}><EditProductPage /></ProtectedRoute>} />
          <Route path="/seller/orders" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerOrdersPage /></ProtectedRoute>} />

          <Route path="/admin/seller-applications" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminSellerApplicationsPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;