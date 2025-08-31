import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login/Login";
import Registration from "./components/registration/Registration";
import SellerDashboard from "./components/seller/SellerDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import CustomerRoutes from "./components/customer/CustomerRoutes";

const AdminLayout = ({ children }) => children;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />

      {/* IMPORTANT CHANGE: Added a "/*" to the path.
        This allows the SellerDashboard component to handle its own nested routes 
        (like /products, /orders, etc.).
      */}
      <Route path="/seller-dashboard/*" element={<SellerDashboard />} />

      <Route path="/admin-dashboard/*" element={<AdminLayout><AdminDashboard /></AdminLayout>} />

      <Route path="/customer/*" element={<CustomerRoutes />} />

      <Route path="*" element={<Navigate to="/customer/" replace />} />
    </Routes>
  );
}

export default App;