import React, { useState, useEffect } from 'react';

const ManageCategories = ({ adminService }) => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [categoriesResponse, subcategoriesResponse] = await Promise.allSettled([
                adminService.getCategories(),
                adminService.getSubcategories()
            ]);

            // Safely check and set categories
            if (categoriesResponse.status === 'fulfilled' && Array.isArray(categoriesResponse.value.data)) {
                setCategories(categoriesResponse.value.data);
            } else {
                setCategories([]);
                console.error("Failed to fetch categories:", categoriesResponse.reason || "Data format error");
            }

            // Safely check and set subcategories
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

    const getCategoryNameById = (categoryId) => {
        const cat = categories.find(c => c.categoryId === categoryId);
        return cat ? cat.categoryName : "Unknown";
    };

    if (loading) {
        return <div>Loading categories...</div>;
    }

    return (
        <div className="manage-section">
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
                                    onClick={() => {
                                        alert('Implement delete subcategory API call here!');
                                    }}
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