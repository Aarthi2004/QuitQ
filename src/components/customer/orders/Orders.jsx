// src/components/customer/orders/Orders.js

import React, { useState, useEffect, useContext } from 'react';
import './Orders.css'; // Your dedicated CSS file
import { CustomerServiceContext } from '../customer.context';

const BACKEND_BASE_URL = 'http://localhost:5193';

const Orders = () => {
    const customerService = useContext(CustomerServiceContext);
    const userId = localStorage.getItem("userId");
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!customerService || !userId) {
            setError("Please log in to view your orders.");
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                const ordersResponse = await customerService.getOrders(userId);
                const ordersData = ordersResponse.data || [];

                // Fetch OTP for each order in parallel
                const updatedOrders = await Promise.all(
                    ordersData.map(async (order) => {
                        try {
                            const otpResponse = await customerService.getShipmentOTPByOrderId(order.orderId);
                            // --- THIS IS THE FIX ---
                            // Changed otpResponse.data.otp to otpResponse.data.OTP (uppercase)
                            return { ...order, shipmentOtp: otpResponse.data.OTP };
                        } catch (err) {
                             console.error(`Failed to fetch OTP for order ${order.orderId}:`, err);
                            return { ...order, shipmentOtp: 'N/A' };
                        }
                    })
                );
                
                // Sort orders by date, newest first
                const sortedOrders = updatedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setOrders(sortedOrders);

            } catch (err) {
                setError("Failed to fetch orders.");
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [customerService, userId]);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    if (loading) return <div className="loading-state">Loading Your Orders...</div>;
    if (error) return <div className="error-state">{error}</div>;

    return (
        <div className="page-container orders-page">
            <h1 className="page-title">My Orders</h1>
            {orders.length > 0 ? (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.orderId} className="order-card">
                            <div className="order-card-header">
                                <div className="header-info">
                                    <span>ORDER PLACED</span>
                                    <span>{formatDate(order.orderDate)}</span>
                                </div>
                                <div className="header-info">
                                    <span>TOTAL</span>
                                    <span>${order.totalAmount?.toFixed(2)}</span>
                                </div>
                                <div className="header-info">
                                    <span>ORDER ID</span>
                                    <span>#{order.orderId}</span>
                                </div>
                                <div className="header-status">
                                    <span className={`status-badge status-${order.orderStatus?.toLowerCase()}`}>
                                        {order.orderStatus}
                                    </span>
                                </div>
                            </div>
                            <div className="order-card-body">
                                {order.orderItemListDTOs?.map(item => (
                                    <div key={item.orderItemId} className="order-item-details">
                                        <img src={`${BACKEND_BASE_URL}${item.product?.productImage}`} alt={item.product?.productName} className="order-item-image" />
                                        <div className="order-item-info">
                                            <h4>{item.product?.productName}</h4>
                                            <p>Qty: {item.quantity}</p>
                                            <p>${item.product?.price?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="order-card-footer">
                                <strong>Delivery OTP:</strong> <span className="otp-display">{order.shipmentOtp}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">You haven't placed any orders yet.</div>
            )}
        </div>
    );
};

export default Orders;