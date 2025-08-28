import React, { useState, useEffect } from 'react';

const ManageStores = ({ adminService }) => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const response = await adminService.getStores();
            if (Array.isArray(response.data)) {
                setStores(response.data);
            } else {
                console.error("API response for stores is not an array:", response.data);
                setStores([]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch stores:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (storeId) => {
        if (window.confirm('Are you sure you want to delete this store?')) {
            try {
                await adminService.deleteStore(storeId);
                alert('Store deleted successfully!');
                fetchStores();
            } catch (error) {
                console.error("Failed to delete store:", error);
                alert('Failed to delete store.');
            }
        }
    };

    if (loading) {
        return <div>Loading stores...</div>;
    }

    return (
        <div className="manage-section">
            <h2>Store List</h2>
            <table className="management-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map(store => (
                        <tr key={store.storeId}>
                            <td>{store.storeId}</td>
                            <td>{store.storeName}</td>
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