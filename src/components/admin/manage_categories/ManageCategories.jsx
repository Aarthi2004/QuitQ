import React, { useState, useEffect } from 'react';
import '../AdminDashboard.css'; // Corrected file path

const ManageCategories = ({ adminService }) => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newCategoryName, setNewCategoryName] = useState('');
    const [newSubcategoryName, setNewSubcategoryName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [categoriesResponse, subcategoriesResponse] = await Promise.allSettled([
                adminService.getCategories(),
                adminService.getSubcategories()
            ]);

            if (categoriesResponse.status === 'fulfilled' && Array.isArray(categoriesResponse.value.data)) {
                setCategories(categoriesResponse.value.data);
                if (categoriesResponse.value.data.length > 0 && !selectedCategoryId) {
                    setSelectedCategoryId(categoriesResponse.value.data[0].categoryId);
                }
            } else {
                setCategories([]);
                console.error("Failed to fetch categories:", categoriesResponse.reason || "Data format error");
            }

            if (subcategoriesResponse.status === 'fulfilled' && Array.isArray(subcategoriesResponse.value.data)) {
                setSubcategories(subcategoriesResponse.value.data);
            } else {
                setSubcategories([]);
                console.error("Failed to fetch subcategories:", subcategoriesResponse.reason || "Data format error");
            }

            setLoading(false);
        } catch (error) {
            console.error("An unexpected error occurred during category/subcategory fetch:", error);
            setLoading(false);
        }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) {
            alert('Category name cannot be empty.');
            return;
        }
        try {
            await adminService.postCategory(newCategoryName);
            alert('Category added successfully!');
            setNewCategoryName('');
            fetchData();
        } catch (error) {
            console.error("Failed to add category:", error);
            alert('Failed to add category. Please try again.');
        }
    };

    const handleSubcategorySubmit = async (e) => {
        e.preventDefault();
        if (!newSubcategoryName.trim() || !selectedCategoryId) {
            alert('Subcategory name and parent category must be selected.');
            return;
        }
        const subcategoryData = {
            subCategoryName: newSubcategoryName,
            categoryId: parseInt(selectedCategoryId, 10),
        };
        try {
            await adminService.postSubcategory(subcategoryData);
            alert('Subcategory added successfully!');
            setNewSubcategoryName('');
            fetchData();
        } catch (error) {
            console.error("Failed to add subcategory:", error);
            alert('Failed to add subcategory. Please try again.');
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category? All related subcategories and products may be affected.')) {
            try {
                await adminService.deleteCategory(categoryId);
                alert('Category deleted successfully!');
                fetchData();
            } catch (error) {
                console.error("Failed to delete category:", error);
                alert('Failed to delete category.');
            }
        }
    };

    const handleDeleteSubcategory = async (subcategoryId) => {
        if (window.confirm('Are you sure you want to delete this subcategory?')) {
            try {
                await adminService.deleteSubcategory(subcategoryId);
                alert('Subcategory deleted successfully!');
                fetchData();
            } catch (error) {
                console.error("Failed to delete subcategory:", error);
                alert('Failed to delete subcategory.');
            }
        }
    };

    const getCategoryNameById = (categoryId) => {
        const cat = categories.find(c => c.categoryId === categoryId);
        return cat ? cat.categoryName : "Unknown";
    };

    if (loading) {
        return <div className="loading-message">Loading categories...</div>;
    }

    return (
        <div className="manage-section">
            <h1>Manage Categories & Subcategories</h1>
            
            <div className="manage-form-container">
                <h3>Add New Category</h3>
                <form className="manage-form" onSubmit={handleCategorySubmit}>
                    <input
                        type="text"
                        placeholder="New Category Name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        required
                    />
                    <button type="submit" className="add-btn">Add Category</button>
                </form>
            </div>

            <div className="manage-form-container">
                <h3>Add New Subcategory</h3>
                <form className="manage-form" onSubmit={handleSubcategorySubmit}>
                    <input
                        type="text"
                        placeholder="New Subcategory Name"
                        value={newSubcategoryName}
                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                        required
                    />
                    <select
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        required
                    >
                        {categories.map(cat => (
                            <option key={cat.categoryId} value={cat.categoryId}>
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="add-btn">Add Subcategory</button>
                </form>
            </div>

            <h2>Category List</h2>
            <table className="management-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category.categoryId}>
                            <td>{category.categoryId}</td>
                            <td>{category.categoryName}</td>
                            <td className="action-buttons">
                                <button className="edit-btn">Edit</button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteCategory(category.categoryId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 style={{ marginTop: '2rem' }}>Subcategory List</h2>
            <table className="management-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Parent Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subcategories.map(sub => (
                        <tr key={sub.subCategoryId}>
                            <td>{sub.subCategoryId}</td>
                            <td>{sub.subCategoryName}</td>
                            <td>{getCategoryNameById(sub.categoryId)}</td>
                            <td className="action-buttons">
                                <button className="edit-btn">Edit</button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteSubcategory(sub.subCategoryId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageCategories;