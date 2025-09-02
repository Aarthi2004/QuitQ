// src/components/customer/account/UserAccount.js

import React, { useState, useEffect, useContext } from 'react';
import './UserAccount.css'; // Import the new dedicated CSS file
import { CustomerServiceContext } from '../customer.context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const UserAccount = () => {
    const customerService = useContext(CustomerServiceContext);
    const userId = localStorage.getItem("userId");

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const initialFormState = {
        doorNumber: '', apartmentName: '', landmark: '', street: '', cityId: '', postalCode: '', contactNumber: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    const fetchAddresses = async () => {
        if (!customerService || !userId) {
            setError("Please log in to view your account details.");
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await customerService.getUserAddresses(userId);
            setAddresses(response.data || []);
        } catch (err) {
            setError("Failed to fetch addresses.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchAddresses();
    }, [customerService, userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAddOrUpdateAddress = async (e) => {
        e.preventDefault();
        const payload = { ...formData, userId: parseInt(userId), statusId: 1, cityId: parseInt(formData.cityId) };
        try {
            if (editingAddress) {
                await customerService.updateUserAddress(editingAddress.userAddressId, payload);
            } else {
                await customerService.addUserAddress(payload);
            }
            setShowAddressForm(false);
            fetchAddresses();
        } catch (error) {
            console.error("Failed to save address:", error);
            alert('Failed to save address.');
        }
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setFormData({ ...address });
        setShowAddressForm(true);
    };

    const handleShowAddressForm = () => {
        setEditingAddress(null);
        setFormData(initialFormState);
        setShowAddressForm(true);
    };

    // Note: You will need to implement deleteUserAddress in your CustomerService if it doesn't exist
    const handleDeleteAddress = async (addressId) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            console.log("Deleting address not yet implemented in service.");
            // try {
            //     await customerService.deleteUserAddress(addressId);
            //     fetchAddresses();
            // } catch (error) { console.error(error); }
        }
    };

    if (loading) return <div className="loading-state">Loading Account Details...</div>;
    if (error) return <div className="error-state">{error}</div>;

    return (
        <div className="page-container account-page">
            <div className="section-header">
                <h1 className="page-title">My Account</h1>
                <button className="add-address-button" onClick={handleShowAddressForm}>
                    <FontAwesomeIcon icon={faPlus} /> Add New Address
                </button>
            </div>

            {showAddressForm && (
                 <form className="address-form" onSubmit={handleAddOrUpdateAddress}>
                     <button type="button" className="address-form-close-btn" onClick={() => setShowAddressForm(false)}>
                         <FontAwesomeIcon icon={faTimes} />
                     </button>
                     <h3 className="address-form-title">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                    <input name="doorNumber" value={formData.doorNumber} onChange={handleInputChange} placeholder="Door Number" required />
                    <input name="apartmentName" value={formData.apartmentName} onChange={handleInputChange} placeholder="Apartment Name" required />
                    <input name="street" value={formData.street} onChange={handleInputChange} placeholder="Street" required />
                    <input name="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="Landmark" />
                    <input name="cityId" type="number" value={formData.cityId} onChange={handleInputChange} placeholder="City ID" required />
                    <input name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="Postal Code" required />
                    <input name="contactNumber" type="tel" value={formData.contactNumber} onChange={handleInputChange} placeholder="Contact Number" required />
                    <div className="address-form-actions">
                        <button type="submit" className="save-button">{editingAddress ? 'Update Address' : 'Save Address'}</button>
                    </div>
                </form>
            )}

            <div className="address-container">
                {addresses.length > 0 ? addresses.map(addr => (
                    <div key={addr.userAddressId} className="address-card">
                        <div className="address-info">
                            <p><strong>{addr.apartmentName}</strong></p>
                            <p>{addr.doorNumber}, {addr.street}, {addr.landmark}</p>
                            <p>City ID: {addr.cityId}, {addr.postalCode}</p>
                            <p>Contact: {addr.contactNumber}</p>
                        </div>
                        <div className="address-actions-inline">
                            <button className="edit-button" onClick={() => handleEditAddress(addr)}>Edit</button>
                            <button className="remove-btn" onClick={() => handleDeleteAddress(addr.userAddressId)}>Remove</button>
                        </div>
                    </div>
                )) : (
                    !showAddressForm && <div className="empty-state">No addresses found. Add one to get started.</div>
                )}
            </div>
        </div>
    );
};

export default UserAccount;