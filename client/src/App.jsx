import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Loader2 } from 'lucide-react';

// Context
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Components (kept as regular imports for stability)
import Layout from './components/Layout/Layout';
import ScrollToHash from './components/Layout/ScrollToHash';
import AdminLayout from './components/Admin/AdminLayout';
import ProtectedRoute from './components/Admin/ProtectedRoute';

// Lazy Pages
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const UserLogin = lazy(() => import('./pages/Auth/UserLogin'));
const UserSignup = lazy(() => import('./pages/Auth/UserSignup'));
const Profile = lazy(() => import('./pages/Auth/Profile'));
const MyOrders = lazy(() => import('./pages/Auth/MyOrders'));
const MyReviews = lazy(() => import('./pages/Auth/MyReviews'));

// Admin Pages (Lazy)
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/Admin/Products'));
const AdminCategories = lazy(() => import('./pages/Admin/Categories'));
const AdminMigration = lazy(() => import('./pages/Admin/Migration'));
const AdminOrders = lazy(() => import('./pages/Admin/Orders'));
const AdminReviews = lazy(() => import('./pages/Admin/Reviews'));
const AdminUsers = lazy(() => import('./pages/Admin/Users'));
const AdminLogin = lazy(() => import('./pages/Admin/Login'));

// Loading Fallback
const PageLoader = () => (
  <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
    <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center animate-pulse">
      <span className="text-white text-2xl font-black italic">SKML</span>
    </div>
    <div className="mt-8 flex flex-col items-center gap-2">
      <Loader2 className="animate-spin text-zinc-900" size={24} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Loading Collection...</p>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <ScrollToHash />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes with Layout */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/shop" element={<Layout><Shop /></Layout>} />
                <Route path="/cart" element={<Layout><Cart /></Layout>} />
                <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
                <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
                <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />

                {/* Customer Auth */}
                <Route path="/login" element={<Layout><UserLogin /></Layout>} />
                <Route path="/signup" element={<Layout><UserSignup /></Layout>} />
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
                <Route path="/my-orders" element={<Layout><MyOrders /></Layout>} />
                <Route path="/my-reviews" element={<Layout><MyReviews /></Layout>} />

                {/* Admin Login */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected Admin Routes with AdminLayout */}
                <Route 
                  path="/admin" 
                  element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} 
                />
                <Route 
                  path="/admin/products" 
                  element={<ProtectedRoute><AdminLayout><AdminProducts /></AdminLayout></ProtectedRoute>} 
                />
                <Route 
                  path="/admin/categories" 
                  element={<ProtectedRoute><AdminLayout><AdminCategories /></AdminLayout></ProtectedRoute>} 
                />
                <Route 
                  path="/admin/orders" 
                  element={<ProtectedRoute><AdminLayout><AdminOrders /></AdminLayout></ProtectedRoute>} 
                />
                <Route 
                  path="/admin/reviews" 
                  element={<ProtectedRoute><AdminLayout><AdminReviews /></AdminLayout></ProtectedRoute>} 
                />
                <Route 
                  path="/admin/users" 
                  element={<ProtectedRoute><AdminLayout><AdminUsers /></AdminLayout></ProtectedRoute>} 
                />
                <Route 
                  path="/admin/migration" 
                  element={<ProtectedRoute><AdminLayout><AdminMigration /></AdminLayout></ProtectedRoute>} 
                />
              </Routes>
            </Suspense>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
