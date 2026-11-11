import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import AdminLayout from './components/layout/AdminLayout'
import AccountLayout from './components/layout/AccountLayout'
import MyStorePage from './pages/seller/MyStorePage'
import SellerProfilePage from './pages/seller/SellerProfilePage'
import StorePage from './pages/customer/StorePage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminOrderDetailsPage from './pages/admin/AdminOrderDetailsPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AddressesPage from './pages/customer/AddressesPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

import ProfilePage from './pages/customer/ProfilePage'
import NotFoundPage from './pages/customer/NotFoundPage'
import PaymentResultPage from './pages/customer/PaymentResultPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import HomePage from './pages/customer/HomePage'
import ProductListPage from './pages/customer/ProductListPage'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import  PaymentPage from './pages/customer/PaymentPage'

import ProductDetailsPage from './pages/customer/ProductDetailsPage'
import CartPage from './pages/customer/CartPage'
import CheckoutPage from './pages/customer/CheckoutPage'
import CustomerOrdersPage from './pages/customer/CustomerOrdersPage'
import CustomerOrderDetailsPage from './pages/customer/CustomerOrderDetailsPage'

import SellerDashboardPage from './pages/seller/SellerDashboardPage'
import SellerApplicationStatusPage from './pages/seller/SellerApplicationStatusPage'
import SellerLayout from './components/layout/SellerLayout'
import SellerProductsPage from './pages/seller/SellerProductsPage'
import AddProductPage from './pages/seller/AddProductPage'
import EditProductPage from './pages/seller/EditProductPage'
import SellerOrdersPage from './pages/seller/SellerOrdersPage'

import AdminSellerApplicationsPage from './pages/admin/AdminSellerApplicationsPage'

// Defines the page routes, shared layouts, and role restrictions.
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/stores/:id" element={<StorePage />} />






          <Route
            path="/cart"
            element={
             
                <CartPage />
             
            }
          />
          <Route
            path="/checkout"
            element={
             
                <CheckoutPage />
              
            }
          />

          <Route
            path="/payment/:orderId"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-result"
            element={
             
                <PaymentResultPage />
              
            }
          />





          <Route
            path="/seller/application-status"
            element={
              <ProtectedRoute>
                <SellerApplicationStatusPage />
              </ProtectedRoute>
            }
          />
          <Route
            element={
              <ProtectedRoute allowedRoles={['SELLER']}>
                <SellerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
            <Route path="/seller/store" element={<MyStorePage />} />
            <Route path="/seller/profile" element={<SellerProfilePage />} />
            <Route path="/seller/products" element={<SellerProductsPage />} />
            <Route path="/seller/products/new" element={<AddProductPage />} />
            <Route path="/seller/products/:id/edit" element={<EditProductPage />} />
            <Route path="/seller/orders" element={<SellerOrdersPage />} />
          </Route>



          {/* Account pages share a sidebar and require a signed-in user of any role. */}
          <Route
            element={
              <ProtectedRoute>
                <AccountLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/addresses" element={<AddressesPage />} />
            <Route path="/orders" element={<CustomerOrdersPage />} />
            <Route path="/orders/:id" element={<CustomerOrderDetailsPage />} />
          </Route>

          {/* Every admin page shares this layout and the ADMIN role check. */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetailsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/seller-applications" element={<AdminSellerApplicationsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
