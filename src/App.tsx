import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Auth
import LoginPage from './pages/auth/LoginPage';
// import RegisterPage from './pages/auth/RegisterPage';
// import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Public and customer
// import HomePage from './pages/customer/HomePage';
// import ProductListPage from './pages/customer/ProductListPage';
// import ProductDetailsPage from './pages/customer/ProductDetailsPage';
// import CartPage from './pages/customer/CartPage';
// import CheckoutPage from './pages/customer/CheckoutPage';
// import CustomerOrdersPage from './pages/customer/CustomerOrdersPage';
// import CustomerOrderDetailsPage from './pages/customer/CustomerOrderDetailsPage';
// import ProfilePage from './pages/customer/ProfilePage';
// import AddressesPage from './pages/customer/AddressesPage';
// import NotFoundPage from './pages/customer/NotFoundPage';

// // Seller
// import SellerApplicationPage from './pages/seller/SellerApplicationPage';
// import SellerApplicationStatusPage from './pages/seller/SellerApplicationStatusPage';
// import SellerDashboardPage from './pages/seller/SellerDashboardPage';
// import SellerStorePage from './pages/seller/SellerStorePage';
// import SellerProductsPage from './pages/seller/SellerProductsPage';
// import AddProductPage from './pages/seller/AddProductPage';
// import EditProductPage from './pages/seller/EditProductPage';
// import SellerOrdersPage from './pages/seller/SellerOrdersPage';
// import SellerOrderDetailsPage from './pages/seller/SellerOrderDetailsPage';
// import SellerSalesPage from './pages/seller/SellerSalesPage';

// // Admin
// import AdminDashboardPage from './pages/admin/AdminDashboardPage';
// import AdminCustomersPage from './pages/admin/AdminCustomersPage';
// import AdminSellersPage from './pages/admin/AdminSellersPage';
// import AdminSellerApplicationsPage from './pages/admin/AdminSellerApplicationsPage';
// import AdminProductsPage from './pages/admin/AdminProductsPage';
// import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
// import AdminOrdersPage from './pages/admin/AdminOrdersPage';
// import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
// import AdminRefundsPage from './pages/admin/AdminRefundsPage';
//import AdminReviewsPage from './pages/admin/AdminReviewsPage';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}

        {/* Public and customer */}
        {/* <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<CustomerOrdersPage />} />
        <Route path="/orders/:id" element={<CustomerOrderDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/addresses" element={<AddressesPage />} /> */}

        {/* Seller */}
        {/* <Route path="/seller/apply" element={<SellerApplicationPage />} />
        <Route path="/seller/application-status" element={<SellerApplicationStatusPage />} />
        <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
        <Route path="/seller/store" element={<SellerStorePage />} />
        <Route path="/seller/products" element={<SellerProductsPage />} />
        <Route path="/seller/products/new" element={<AddProductPage />} />
        <Route path="/seller/products/:id/edit" element={<EditProductPage />} />
        <Route path="/seller/orders" element={<SellerOrdersPage />} />
        <Route path="/seller/orders/:id" element={<SellerOrderDetailsPage />} />
        <Route path="/seller/sales" element={<SellerSalesPage />} /> */}

        {/* Admin */}
        {/* <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/customers" element={<AdminCustomersPage />} />
        <Route path="/admin/sellers" element={<AdminSellersPage />} />
        <Route path="/admin/seller-applications" element={<AdminSellerApplicationsPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/payments" element={<AdminPaymentsPage />} />
        <Route path="/admin/refunds" element={<AdminRefundsPage />} />
        <Route path="/admin/reviews" element={<AdminReviewsPage />} /> */}

        {/* Fallback */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;