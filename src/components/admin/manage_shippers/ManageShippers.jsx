// /src/components/admin/manage_shippers/ManageShippers.jsx

import React, { useState, useEffect } from 'react';
import './ManageShippers.css';
import { FaTruck, FaClipboardCheck, FaKey, FaSyncAlt } from 'react-icons/fa';

const orderStatusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Returned', 'Cancelled'];

const ManageShippers = ({ adminService }) => {
    const [shippers, setShippers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [otpInput, setOtpInput] = useState({});
    const [statusInput, setStatusInput] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchShippers();
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    const fetchShippers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminService.getShippers();
            // Check if the response data is an array before setting the state
            if (Array.isArray(response.data)) {
                setShippers(response.data);
                // Initialize status and OTP inputs for each shipper
                const initialStatusInput = {};
                const initialOtpInput = {};
                response.data.forEach(shipper => {
                    initialStatusInput[shipper.shipperId] = '';
                    initialOtpInput[shipper.shipperId] = '';
                });
                setStatusInput(initialStatusInput);
                setOtpInput(initialOtpInput);
            } else {
                console.error("API response for shippers is not an array:", response.data);
                setShippers([]);
            }
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch shippers:', err);
            setError('Failed to load shipper data.');
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (shipperId, orderId, apiType) => {
        const status = statusInput[shipperId];
        if (!status) {
            setErrorMessage('Please select a status to update.');
            return;
        }

        try {
            if (apiType === 'delivery') {
                await adminService.updateDeliveryStatus(shipperId, orderId, status);
            } else {
                await adminService.updateOrderStatus(orderId, status);
            }
            setSuccessMessage(`Order ID ${orderId} status updated to '${status}' successfully!`);
            fetchShippers();
        } catch (err) {
            console.error('Failed to update status:', err);
            setErrorMessage('Failed to update status. Please try again.');
        }
    };

    const handleGenerateOTP = async (shipperId) => {
        try {
            await adminService.generateShipperOTP(shipperId);
            setSuccessMessage(`OTP generation initiated for Shipper ID ${shipperId}. (OTP sent to customer)`);
            fetchShippers();
        } catch (err) {
            console.error('Failed to generate OTP:', err);
            setErrorMessage('Failed to generate OTP. Please ensure the shipment is valid.');
        }
    };

    const handleValidateOTP = async (shipperId, orderId) => {
        const otp = otpInput[shipperId];
        if (!otp) {
            setErrorMessage('Please enter OTP to validate.');
            return;
        }
        try {
            const response = await adminService.validateShipperOTP(shipperId, otp, orderId);
            if (response.data === true) {
                setSuccessMessage(`OTP for Shipper ID ${shipperId} is valid!`);
            } else {
                setErrorMessage(`OTP for Shipper ID ${shipperId} is invalid.`);
            }
        } catch (err) {
            console.error('Failed to validate OTP:', err);
            setErrorMessage('Failed to validate OTP. Check the entered OTP and try again.');
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Pending': return 'status-pending';
            case 'Processing': return 'status-processing';
            case 'Shipped': return 'status-shipped';
            case 'Delivered': return 'status-delivered';
            case 'Returned': return 'status-returned';
            case 'Cancelled': return 'status-cancelled';
            default: return 'status-unknown';
        }
    };
    
    if (loading) {
        return <div className="loading-spinner">Loading shippers...</div>;
    }
    
    if (error) {
        return <div className="error-card">{error}</div>;
    }

    if (shippers.length === 0) {
        return <div className="no-data-message">No shippers found.</div>;
    }
    
    return (
        <div className="manage-shippers-container">
            <h2 className="section-title"><FaTruck /> Shipper Operations</h2>
            {successMessage && <div className="alert-message success"><FaClipboardCheck /> {successMessage}</div>}
            {errorMessage && <div className="alert-message error">{errorMessage}</div>}

            <div className="shippers-grid">
                {shippers.map((shipper) => (
                    <div className="shipper-card" key={shipper.shipperId}>
                        <div className="shipper-header">
                            <h3>Shipper ID: {shipper.shipperId}</h3>
                            <p>Order ID: <strong>{shipper.orderId}</strong></p>
                        </div>
                        <div className="shipper-actions">
                            <div className="action-group">
                                <h4><FaKey /> OTP Management</h4>
                                <button
                                    onClick={() => handleGenerateOTP(shipper.shipperId)}
                                    className="btn btn-primary"
                                    title="Generate and send OTP to customer"
                                >
                                    <FaSyncAlt /> Generate OTP
                                </button>
                                <div className="otp-validation-section">
                                    <input
                                        type="text"
                                        placeholder="Enter OTP from customer"
                                        value={otpInput[shipper.shipperId] || ''}
                                        onChange={(e) => setOtpInput({ ...otpInput, [shipper.shipperId]: e.target.value })}
                                        className="input-field"
                                        aria-label={`OTP for Shipper ID ${shipper.shipperId}`}
                                    />
                                    <button
                                        onClick={() => handleValidateOTP(shipper.shipperId, shipper.orderId)}
                                        className="btn btn-secondary"
                                        title="Validate customer provided OTP"
                                    >
                                        Validate OTP
                                    </button>
                                </div>
                            </div>

                            <div className="action-group">
                                <h4><FaClipboardCheck /> Update Order Status</h4>
                                <div className="status-update-section">
                                    <select
                                        value={statusInput[shipper.shipperId] || ''}
                                        onChange={(e) => setStatusInput({ ...statusInput, [shipper.shipperId]: e.target.value })}
                                        className="select-field"
                                        aria-label={`Select status for Order ID ${shipper.orderId}`}
                                    >
                                        <option value="">Select New Status</option>
                                        {orderStatusOptions.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => {
                                            const newStatus = statusInput[shipper.shipperId];
                                            if (newStatus) {
                                                const apiType = (newStatus === 'Delivered' || newStatus === 'Returned') ? 'delivery' : 'order';
                                                handleUpdateStatus(shipper.shipperId, shipper.orderId, apiType);
                                            }
                                        }}
                                        className="btn btn-success"
                                        title="Update order status"
                                    >
                                        Update Status
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageShippers;