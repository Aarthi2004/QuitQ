import React, { useState, useEffect } from "react";

const ManageOrders = ({ adminService }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await adminService.getAllOrders();
                if (Array.isArray(response.data)) {
                    setOrders(response.data);
                } else {
                    console.error("API response for orders is not an array:", response.data);
                    setOrders([]);
                }
            } catch (err) {
                console.error("Failed to fetch all orders:", err);
                setError("Failed to load orders. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllOrders();
    }, [adminService]);

    return (
        <div className="manage-section">
            <h2>All Orders Overview</h2>
            
            {loading && <p>Loading all orders...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && orders.length > 0 && (
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User ID</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Shipper</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.orderId}>
                                <td>{order.orderId}</td>
                                <td>{order.userId}</td>
                                <td>${order.totalAmount}</td>
                                <td>{order.orderStatus}</td>
                                <td>{new Date(order.orderDate).toLocaleString()}</td>
                                <td>{order.shipper}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {!loading && orders.length === 0 && !error && (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default ManageOrders;