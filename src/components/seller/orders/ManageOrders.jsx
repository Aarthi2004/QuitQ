import React, { useState, useEffect, useContext } from 'react';
import { SellerServiceContext } from '../seller.context';
import Modal from '../shared/Modal';

const ManageOrders = () => {
    const sellerService = useContext(SellerServiceContext);
    const sellerId = localStorage.getItem("userId");

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [otp, setOtp] = useState('');

    const fetchOrders = async () => {
        if (!sellerId) {
            setError("Could not find your user ID. Please log in again.");
            setLoading(false);
            return;
        }
        try { 
            setLoading(true);
            
            const storesResponse = await sellerService.getUserStores(sellerId);
            const sellerStores = storesResponse.data || [];

            if (sellerStores.length > 0) {
                const orderPromises = sellerStores.map(store => sellerService.getOrdersByStore(store.storeId));
                const orderResponses = await Promise.all(orderPromises);
                setOrders(orderResponses.flatMap(res => res.data || []));
            } else {
                setOrders([]);
            }

            setError(null);
        } catch (err) {
            setError("Failed to fetch orders. An API endpoint may be missing.");
            console.error(err);
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [sellerService, sellerId]);

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await sellerService.updateOrder({ orderId, orderStatus: newStatus });
            alert('Order status updated!');
            fetchOrders();
        } catch (err) { alert('Failed to update order status.'); }
    };
    
    const handleGenerateOtp = async (shipId) => {
        if (!shipId) { alert("Shipment ID not found for this order."); return; }
        try {
            await sellerService.generateOtp(shipId);
            alert(`OTP generated for Shipment #${shipId}.`);
        } catch (err) { alert('Failed to generate OTP.'); }
    };

    const openOtpModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleValidateOtp = async () => {
        if (!otp) { alert("Please enter the OTP."); return; }
        try {
            await sellerService.validateOtp({
                shipperId: sellerId, // The seller is also the shipper in this context
                OTP: otp,
                orderId: selectedOrder.orderId
            });
            alert('OTP Validated! Order marked as Delivered.');
            setIsModalOpen(false);
            setOtp('');
            fetchOrders();
        } catch (err) { alert('OTP validation failed.'); }
    };

    if (loading) return <p className="loading-state">Loading orders...</p>;
    if (error) return <p className="error-state">{error}</p>;

    return (
        <div>
            <div className="page-header"><h2 className="page-title">Order & Shipment Management</h2></div>
            <div className="seller-card">
                <div className="card-header"><h3 className="card-title">Customer Orders</h3></div>
                <table className="data-table">
                    <thead><tr><th>Order ID</th><th>Date</th><th>Shipment ID</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.orderId}>
                                <td>#{order.orderId}</td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td>#{order.shipmentId || 'N/A'}</td>
                                <td>${order.totalAmount.toFixed(2)}</td>
                                <td><span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span></td>
                                <td className="table-actions">
                                    <select className="form-select" value={order.orderStatus} onChange={(e) => handleUpdateOrderStatus(order.orderId, e.target.value)}>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <button className="btn btn-secondary btn-sm" onClick={() => handleGenerateOtp(order.shipmentId)}>Get OTP</button>
                                    <button className="btn btn-primary btn-sm" onClick={() => openOtpModal(order)}>Validate</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Validate OTP for Order #${selectedOrder?.orderId}`}>
                <div className="form-group">
                    <label htmlFor="otp">Enter Delivery OTP</label>
                    <input id="otp" type="text" className="form-input" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code"/>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleValidateOtp}>Validate & Complete</button>
                </div>
            </Modal>
        </div>
    );
};

export default ManageOrders;