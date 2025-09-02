import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login/Login";
import Registration from "./components/registration/Registration";
import SellerDashboard from "./components/seller/SellerDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import CustomerRoutes from "./components/customer/CustomerRoutes";
import ResetPassword from "./components/reset_password/ResetPassword";
import HomePage from "./components/home/HomePage"; // <-- IMPORT THE NEW HOME PAGE

const AdminLayout = ({ children }) => children;

function App() {
  return (
    <Routes>
      {/* --- THIS IS THE KEY CHANGE --- */}
      <Route path="/" element={<HomePage />} /> 

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/seller-dashboard/*" element={<SellerDashboard />} />
      <Route path="/admin-dashboard/*" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/customer/*" element={<CustomerRoutes />} />
      
      {/* Optional: You can keep this or remove it. If a user tries an invalid path while logged in, it will redirect them to their dashboard. */}
      <Route path="*" element={<Navigate to="/customer/" replace />} />
    </Routes>
  );
}

export default App;