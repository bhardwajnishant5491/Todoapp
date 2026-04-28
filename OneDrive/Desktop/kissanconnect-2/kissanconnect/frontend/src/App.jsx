import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Settings from './pages/Settings';
import Wallet from './pages/Wallet';
import PaymentSimulation from './pages/PaymentSimulation';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import AddCrop from './pages/farmer/AddCrop';
import MyCrops from './pages/farmer/MyCrops';
import FarmerContracts from './pages/farmer/FarmerContracts';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import CropBrowser from './pages/buyer/CropBrowser';
import CropDetails from './pages/buyer/CropDetails';
import BuyerContracts from './pages/buyer/BuyerContracts';
import BuyerOrders from './pages/buyer/BuyerOrders';
import Chat from './pages/Chat';
import MyDisputes from './pages/MyDisputes';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminWithdrawals from './pages/admin/AdminWithdrawals';
import AdminDisputes from './pages/admin/AdminDisputes';
import AdminSettings from './pages/admin/AdminSettings';
import AdminContracts from './pages/admin/AdminContracts';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminDataIntegrity from './pages/admin/AdminDataIntegrity';

import './index.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* Protected Routes - Farmer */}
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/add-crop"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <AddCrop />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/edit-crop/:id"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <AddCrop />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/crops"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <MyCrops />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/contracts"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmerContracts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/disputes"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <MyDisputes />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Buyer */}
          <Route
            path="/buyer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/browse-crops"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <CropBrowser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/crop/:id"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <CropDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/contracts"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerContracts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/disputes"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <MyDisputes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/orders"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerOrders />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/contracts"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminContracts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/withdrawals"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminWithdrawals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/disputes"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDisputes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAuditLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/data-integrity"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDataIntegrity />
              </ProtectedRoute>
            }
          />

          {/* Settings Route - Accessible by all authenticated users */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'buyer', 'admin']}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Wallet Route - Accessible by all authenticated users */}
          <Route
            path="/wallet"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'buyer']}>
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet/add-funds"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'buyer']}>
                <PaymentSimulation />
              </ProtectedRoute>
            }
          />

          {/* Chat Route - Accessible by farmers and buyers */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'buyer']}>
                <Chat />
              </ProtectedRoute>
            }
          />

          {/* 404 - Not Found */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Page not found</p>
                  <a href="/" className="btn-primary">
                    Go Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
