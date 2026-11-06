import AdminProductsPage from './pages/admin/AdminProductsPage'
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

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-result"
            element={
              <ProtectedRoute>
                <PaymentResultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <CustomerOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <CustomerOrderDetailsPage />
              </ProtectedRoute>
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
            <Route path="/seller/products" element={<SellerProductsPage />} />
            <Route path="/seller/products/new" element={<AddProductPage />} />
            <Route path="/seller/products/:id/edit" element={<EditProductPage />} />
            <Route path="/seller/orders" element={<SellerOrdersPage />} />
          </Route>

          <Route
            path="/admin/seller-applications"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminSellerApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminProductsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
