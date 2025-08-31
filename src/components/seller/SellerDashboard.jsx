import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SellerServiceProvider } from './seller.context';
import SellerLayout from './SellerLayout';
import SellerDashboardPage from './dashboard/SellerDashboardPage';
import ManageProducts from './products/ManageProducts';
import ManageOrders from './orders/ManageOrders';

function SellerDashboard() {
  return (
    <SellerServiceProvider>
      <Routes>
        <Route element={<SellerLayout />}>
          <Route index element={<SellerDashboardPage />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="orders" element={<ManageOrders />} />
        </Route>
      </Routes>
    </SellerServiceProvider>
  );
}

export default SellerDashboard;