import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CustomerServiceProvider } from './customer.context';
import CustomerDashboard from './dashboard/CustomerDashboard';
import Cart from './cart/Cart';
import Wishlist from './wishlist/Wishlist';
import UserAccount from './account/UserAccount';
import Orders from './orders/Orders';
import Layout from './Layout';

const CustomerRoutes = () => {
    return (
        <CustomerServiceProvider>
            <Layout>
                <Routes>
                    <Route index element={<CustomerDashboard />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="account" element={<UserAccount />} />
                    <Route path="orders" element={<Orders />} />
                </Routes>
            </Layout>
        </CustomerServiceProvider>
    );
};

export default CustomerRoutes;