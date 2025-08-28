import React, { useState, useEffect } from 'react';
import '../AdminDashboard.css';

const ManageStores = ({ adminService }) => {
    const [stores, setStores] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newStoreName, setNewStoreName] = useState('');
    const [newStoreDesc, setNewStoreDesc] = useState('');
    const [newStoreAddress, setNewStoreAddress] = useState('');
    const [newStoreContact, setNewStoreContact] = useState('');
    const [newStoreImage, setNewStoreImage] = useState(null);
    const [newStoreCityId, setNewStoreCityId] = useState('');
    const [newStoreSellerId, setNewStoreSellerId] = useState('');

    useEffect(() => {
        fetchData();
    }, [adminService]); // Re-fetch data if the service instance changes

    const fetchData = async () => {
        setLoading(true);
        try {
            const [storesResponse, citiesResponse] = await Promise.allSettled([
                adminService.getStores(),
                adminService.getCities()
            ]);

            if (storesResponse.status === 'fulfilled' && Array.isArray(storesResponse.value.data)) {
                setStores(storesResponse.value.data);
            } else {
                setStores([]);
                console.error("API response for stores is not an array:", storesResponse.reason || "Data format error");
            }
            if (citiesResponse.status === 'fulfilled' && Array.isArray(citiesResponse.value.data)) {
                setCities(citiesResponse.value.data);
                if (citiesResponse.value.data.length > 0 && !newStoreCityId) {
                    setNewStoreCityId(citiesResponse.value.data[0].cityId);
                }
            } else {
                setCities([]);
                console.error("API response for cities is not an array:", citiesResponse.reason || "Data format error");
            }

        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleStoreSubmit = async (e) => {
        e.preventDefault();
        if (!newStoreName.trim() || !newStoreAddress.trim() || !newStoreContact.trim() || !newStoreSellerId) {
            alert('Store Name, Seller ID, Address, and Contact Number are required.');
            return;
        }

        const formData = new FormData();
        formData.append('StoreName', newStoreName);
        formData.append('Description', newStoreDesc);
        formData.append('StoreFullAddress', newStoreAddress);
        formData.append('ContactNumber', newStoreContact);
        formData.append('CityId', parseInt(newStoreCityId, 10));
        formData.append('SellerId', parseInt(newStoreSellerId, 10));

        if (newStoreImage) {
            formData.append('StoreImageFile', newStoreImage);
        }

        try {
            await adminService.postStore(formData);
            alert('Store added successfully!');
            setNewStoreName('');
            setNewStoreDesc('');
            setNewStoreAddress('');
            setNewStoreContact('');
            setNewStoreImage(null);
            setNewStoreSellerId('');
            fetchData();
        } catch (error) {
            console.error("Failed to add store:", error);
            alert('Failed to add store. Please check the network or server logs.');
        }
    };

    const handleDelete = async (storeId) => {
        if (window.confirm('Are you sure you want to delete this store?')) {
            try {
                await adminService.deleteStore(storeId);
                alert('Store deleted successfully!');
                fetchData();
            } catch (error) {
                console.error("Failed to delete store:", error);
                alert('Failed to delete store.');
            }
        }
    };

    if (loading) {
        return <div className="loading-message">Loading stores...</div>;
    }

    return (
        <div className="manage-section">
            <h1>Manage Stores</h1>
            <div className="manage-form-container">
                <h3>Add New Store</h3>
                <form className="manage-form" onSubmit={handleStoreSubmit}>
                    <input
                        type="text"
                        placeholder="Store Name"
                        value={newStoreName}
                        onChange={(e) => setNewStoreName(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={newStoreDesc}
                        onChange={(e) => setNewStoreDesc(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Full Address"
                        value={newStoreAddress}
                        onChange={(e) => setNewStoreAddress(e.target.value)}
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Contact Number"
                        value={newStoreContact}
                        onChange={(e) => setNewStoreContact(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Seller ID"
                        value={newStoreSellerId}
                        onChange={(e) => setNewStoreSellerId(e.target.value)}
                        required
                    />
                    <select
                        value={newStoreCityId}
                        onChange={(e) => setNewStoreCityId(e.target.value)}
                        required
                    >
                        {cities.map(city => (
                            <option key={city.cityId} value={city.cityId}>
                                {city.cityName}
                            </option>
                        ))}
                    </select>
                    <input
                        type="file"
                        onChange={(e) => setNewStoreImage(e.target.files[0])}
                        accept="image/*"
                    />
                    <button type="submit" className="add-btn">Add Store</button>
                </form>
            </div>

            <h2>Store List</h2>
            <table className="management-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Seller ID</th>
                        <th>Contact</th>
                        <th>City</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map(store => (
                        <tr key={store.storeId}>
                            <td>{store.storeId}</td>
                            <td>{store.storeName}</td>
                            <td>{store.sellerId}</td>
                            <td>{store.contactNumber}</td>
                            <td>{store.cityId}</td>
                            <td className="action-buttons">
                                <button className="edit-btn">Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(store.storeId)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageStores;