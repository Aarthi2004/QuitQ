import React, { useState, useEffect } from 'react';

const ManageProducts = ({ adminService }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await adminService.getProducts();
            if (Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                console.error("API response for products is not an array:", response.data);
                setProducts([]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await adminService.deleteProduct(productId);
                alert('Product deleted successfully!');
                fetchProducts();
            } catch (error) {
                console.error("Failed to delete product:", error);
                alert('Failed to delete product.');
            }
        }
    };

    if (loading) {
        return <div>Loading products...</div>;
    }

    return (
        <div className="manage-section">
            <h2>Product List</h2>
            <table className="management-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Store</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.productId}>
                            <td>{product.productId}</td>
                            <td>{product.productName}</td>
                            <td>${product.price.toFixed(2)}</td>
                            <td>{product.storeName}</td>
                            <td className="action-buttons">
                                <button className="edit-btn">Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(product.productId)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageProducts;