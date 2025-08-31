import React, { useState, useEffect, useContext } from 'react';
import '../dashboard/CustomerDashboard.css'; // Corrected Path
import { CustomerServiceContext } from '../customer.context'; // Corrected Path

const BACKEND_BASE_URL = 'http://localhost:5193';

const Orders = () => {
    const customerService = useContext(CustomerServiceContext);
    
    // Get the dynamic userId from localStorage
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

        const fetchOrdersAndOtps = async () => {
            try {
                // Use the dynamic userId in the API call
                const ordersResponse = await customerService.getOrders(userId);
                const ordersData = ordersResponse.data || [];

                const otpPromises = ordersData.map(async (order) => {
                    try {
                        const otpResponse = await customerService.getShipmentOTPByOrderId(order.orderId);
                        return { ...order, otp: otpResponse.data.OTP };
                    } catch (err) {
                        console.error(`Failed to fetch OTP for order ${order.orderId}:`, err);
                        return { ...order, otp: null };
                    }
                });

                const updatedOrders = await Promise.all(otpPromises);
                setOrders(updatedOrders);

            } catch (err) {
                setError("Failed to fetch orders. Please check your network connection.");
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrdersAndOtps();
    }, [customerService, userId]);

    if (loading) return <div className="loading-state">Loading orders...</div>;
    if (error) return <div className="error-state">{error}</div>;

    const getProductImage = (product) => {
        const imageUrl = product.productImage
            ? `${BACKEND_BASE_URL}${product.productImage}`
            : 'https://via.placeholder.com/60x60.png?text=No+Image';
        return imageUrl;
    };

    return (
        <section className="page-section">
            <h2 className="section-title">My Orders</h2>
            {orders.length > 0 ? (
                <div className="order-list">
                    {orders.map(order => (
                        <div className="order-card" key={order.orderId}>
                            <div className="order-item-list">
                                <p className="order-id">Order ID: #{order.orderId}</p>
                                {order.orderItemListDTOs.map(item => (
                                    <div key={item.orderItemId} className="order-item-details">
                                        <img src={getProductImage(item.product)} alt={item.product.productName} className="order-item-image" />
                                        <div className="order-item-info">
                                            <h4>{item.product.productName}</h4>
                                            <p>Quantity: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="order-summary">
                                <div className="summary-item">
                                    <strong>Total Amount:</strong>
                                    <p>${order.totalAmount.toFixed(2)}</p>
                                </div>
                                <div className="summary-item">
                                    <strong>Status:</strong>
                                    <span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span>
                                </div>
                                {order.otp && (
                                    <div className="summary-item">
                                        <strong>Delivery OTP:</strong>
                                        <span className="otp-display">{order.otp}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p>You have not placed any orders yet.</p>
                </div>
            )}
        </section>
    );
};

export default Orders;