import React, { useState, useEffect } from 'react';

const ManageBrands = ({ adminService }) => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await adminService.getBrands();
            // Check if the response data is an array before setting the state
            if (Array.isArray(response.data)) {
                setBrands(response.data);
            } else {
                console.error("API response for brands is not an array:", response.data);
                setBrands([]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch brands:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (brandId) => {
        if (window.confirm('Are you sure you want to delete this brand? This action is permanent.')) {
            try {
                await adminService.deleteBrand(brandId);
                alert('Brand deleted successfully!');
                fetchBrands();
            } catch (error) {
                console.error("Failed to delete brand:", error);
                alert('Failed to delete brand.');
            }
        }
    };

    if (loading) {
        return <div>Loading brands...</div>;
    }

    return (
        <div className="manage-section">
            <h2>Brand List</h2>
            <table className="management-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {brands.map(brand => (
                        <tr key={brand.brandId}>
                            <td>{brand.brandId}</td>
                            <td>{brand.brandName}</td>
                            <td className="action-buttons">
                                <button className="edit-btn">Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(brand.brandId)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageBrands;