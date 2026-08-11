import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Products from './pages/products/Products'
import ProductDetail from './pages/products/ProductDetail'
import AddProduct from './pages/products/AddProduct'
import EditProduct from './pages/products/EditProduct'
import Categories from './pages/categories/Categories'
import Suppliers from './pages/suppliers/Suppliers'
import StockIn from './pages/inventory/StockIn'
import StockOut from './pages/inventory/StockOut'
import Transactions from './pages/inventory/Transactions'
import Profile from './pages/profile/Profile'
import ChangePassword from './pages/profile/ChangePassword'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/products" replace />;
  return <Layout>{children}</Layout>;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to={user.role === 'admin' ? "/dashboard" : "/products"} replace />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      
      {/* Protected Routes (Employee & Admin) */}
      <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
      <Route path="/inventory/stock-in" element={<ProtectedRoute><StockIn /></ProtectedRoute>} />
      <Route path="/inventory/stock-out" element={<ProtectedRoute><StockOut /></ProtectedRoute>} />
      <Route path="/inventory/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

      {/* Admin Only Routes */}
      <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/products/add" element={<AdminRoute><AddProduct /></AdminRoute>} />
      <Route path="/products/edit/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
      <Route path="/categories" element={<AdminRoute><Categories /></AdminRoute>} />
      <Route path="/suppliers" element={<AdminRoute><Suppliers /></AdminRoute>} />
    </Routes>
  )
}

export default App
