import React, { useState, useEffect } from 'react';
import '../AdminDashboard.css';

const ManageBrands = ({ adminService }) => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for the Add Brand form
    const [newBrandName, setNewBrandName] = useState('');
    const [newBrandLogo, setNewBrandLogo] = useState(null);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await adminService.getBrands();
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

    const handleBrandSubmit = async (e) => {
        e.preventDefault();
        if (!newBrandName.trim()) {
            alert('Brand name cannot be empty.');
            return;
        }

        const formData = new FormData();
        formData.append('BrandName', newBrandName);
        if (newBrandLogo) {
            formData.append('BrandLogoImg', newBrandLogo);
        }

        try {
            await adminService.postBrand(formData);
            alert('Brand added successfully!');
            setNewBrandName('');
            setNewBrandLogo(null);
            fetchBrands();
        } catch (error) {
            console.error("Failed to add brand:", error);
            alert('Failed to add brand. Please try again.');
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
        return <div className="loading-message">Loading brands...</div>;
    }

    return (
        <div className="manage-section">
            <h1>Manage Brands</h1>
            <div className="manage-form-container">
                <h3>Add New Brand</h3>
                <form className="manage-form" onSubmit={handleBrandSubmit}>
                    <input
                        type="text"
                        placeholder="Brand Name"
                        value={newBrandName}
                        onChange={(e) => setNewBrandName(e.target.value)}
                        required
                    />
                    <input
                        type="file"
                        onChange={(e) => setNewBrandLogo(e.target.files[0])}
                        accept="image/*"
                    />
                    <button type="submit" className="add-btn">Add Brand</button>
                </form>
            </div>

            <h2>Brand List</h2>
            <table className="management-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Logo</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {brands.map(brand => (
                        <tr key={brand.brandId}>
                            <td>{brand.brandId}</td>
                            <td>{brand.brandName}</td>
                            <td>
                                {brand.brandLogo && (
                                    <img src={brand.brandLogo} alt={brand.brandName} style={{ height: '50px' }} />
                                )}
                            </td>
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