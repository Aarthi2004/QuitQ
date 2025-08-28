import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login/Login";
import Registration from "./components/registration/Registration";
import SellerDashboard from "./components/seller/SellerDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import CustomerDashboard from "./components/customer/CustomerDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/seller-dashboard" element={<SellerDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/customer-dashboard" element={<CustomerDashboard />} />
    </Routes>
  );
}

export default App;