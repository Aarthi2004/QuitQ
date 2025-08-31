import React, { useState, useEffect, useContext } from 'react';
import '../dashboard/CustomerDashboard.css'; // Corrected Path
import { CustomerServiceContext } from '../customer.context'; // Corrected Path

const UserAccount = () => {
    const customerService = useContext(CustomerServiceContext);

    // Get the dynamic userId from localStorage
    const userId = localStorage.getItem("userId");

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [newAddress, setNewAddress] = useState({
        doorNumber: '', apartmentName: '', landmark: '', street: '', cityId: '', postalCode: '', contactNumber: ''
    });

    useEffect(() => {
        if (!customerService || !userId) {
            setError("Please log in to view your account details.");
            setLoading(false);
            return;
        }

        const fetchAddresses = async () => {
            try {
                const response = await customerService.getUserAddresses(userId);
                setAddresses(response.data || []);
            } catch (err) {
                setError("Failed to fetch addresses. Please try again.");
                console.error("Failed to fetch addresses:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAddresses();
    }, [customerService, userId]);

    const fetchUpdatedAddresses = async () => {
        if (!userId) return;
        const response = await customerService.getUserAddresses(userId);
        setAddresses(response.data || []);
    };

    const handleAddOrUpdateAddress = async (e) => {
        e.preventDefault();
        try {
            if (editingAddress) {
                await customerService.updateUserAddress(editingAddress.userAddressId, { ...newAddress, userId: userId, statusId: 1 });
                alert('Address updated successfully!');
            } else {
                await customerService.addUserAddress({ ...newAddress, userId: userId, statusId: 1 });
                alert('Address added successfully!');
            }
            fetchUpdatedAddresses();
            setNewAddress({ doorNumber: '', apartmentName: '', landmark: '', street: '', cityId: '', postalCode: '', contactNumber: '' });
            setEditingAddress(null);
            setShowAddressForm(false);
        } catch (error) {
            console.error("Failed to save address:", error);
            alert('Failed to save address.');
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                await customerService.deleteUserAddress(addressId);
                fetchUpdatedAddresses();
                alert('Address deleted successfully!');
            } catch (error) {
                console.error("Failed to delete address:", error);
                alert('Failed to delete address.');
            }
        }
    };
    
    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setNewAddress({ ...address });
        setShowAddressForm(true);
    };

    const handleShowAddressForm = () => {
        setEditingAddress(null);
        setNewAddress({ doorNumber: '', apartmentName: '', landmark: '', street: '', cityId: '', postalCode: '', contactNumber: '' });
        setShowAddressForm(true);
    };

    if (loading) return <div className="loading-state">Loading account details...</div>;
    if (error) return <div className="error-state">{error}</div>;

    return (
        <div className="page-content-container">
            <div className="page-section">
                <div className="section-header">
                    <h2 className="section-title">My Addresses</h2>
                    <button className="add-address-button" onClick={handleShowAddressForm}>
                        (+) Add New Address
                    </button>
                </div>
                {showAddressForm ? (
                    <form className="address-form" onSubmit={handleAddOrUpdateAddress}>
                        <button type="button" className="address-form-close-btn" onClick={() => setShowAddressForm(false)}>
                            &times;
                        </button>
                        <input type="text" placeholder="Door Number" value={newAddress.doorNumber} onChange={(e) => setNewAddress({ ...newAddress, doorNumber: e.target.value })} required />
                        <input type="text" placeholder="Apartment Name" value={newAddress.apartmentName} onChange={(e) => setNewAddress({ ...newAddress, apartmentName: e.target.value })} required />
                        <input type="text" placeholder="Landmark" value={newAddress.landmark} onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })} />
                        <input type="text" placeholder="Street" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} required />
                        <input type="number" placeholder="City ID" value={newAddress.cityId} onChange={(e) => setNewAddress({ ...newAddress, cityId: parseInt(e.target.value) || '' })} required />
                        <input type="text" placeholder="Postal Code" value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} required />
                        <input type="tel" placeholder="Contact Number" value={newAddress.contactNumber} onChange={(e) => setNewAddress({ ...newAddress, contactNumber: e.target.value })} required />
                        <div className="address-form-actions">
                            <button type="submit" className="save-button">{editingAddress ? 'Update Address' : 'Save Address'}</button>
                        </div>
                    </form>
                ) : (
                    <div className="address-container">
                        {addresses.length > 0 ? (
                            addresses.map(address => (
                                <div className="address-card" key={address.userAddressId}>
                                    <div className="address-info">
                                        <p><strong>{address.apartmentName}</strong></p>
                                        <p>{address.doorNumber}, {address.street}</p>
                                        <p>{address.postalCode}</p>
                                        <p>Contact: {address.contactNumber}</p>
                                    </div>
                                    <div className="address-actions-inline">
                                        <button className="edit-button" onClick={() => handleEditAddress(address)}>
                                            Edit
                                        </button>
                                        <button className="remove-btn" onClick={() => handleDeleteAddress(address.userAddressId)}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">No addresses found. Add a new one.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserAccount;