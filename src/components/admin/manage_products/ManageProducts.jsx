import React, { useState, useEffect } from 'react';
import '../AdminDashboard.css';

const ManageProducts = ({ adminService }) => {
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [adminService]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsResponse, storesResponse, brandsResponse, categoriesResponse] = await Promise.allSettled([
                adminService.getProducts(),
                adminService.getStores(),
                adminService.getBrands(),
                adminService.getCategories(),
            ]);

            if (productsResponse.status === 'fulfilled' && Array.isArray(productsResponse.value.data)) {
                setProducts(productsResponse.value.data);
            }
            if (storesResponse.status === 'fulfilled' && Array.isArray(storesResponse.value.data)) {
                setStores(storesResponse.value.data);
            }
            if (brandsResponse.status === 'fulfilled' && Array.isArray(brandsResponse.value.data)) {
                setBrands(brandsResponse.value.data);
            }
            if (categoriesResponse.status === 'fulfilled' && Array.isArray(categoriesResponse.value.data)) {
                setCategories(categoriesResponse.value.data);
            }

        } catch (error) {
            console.error("Failed to fetch product data:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await adminService.deleteProduct(productId);
                alert('Product deleted successfully!');
                fetchData();
            } catch (error) {
                console.error("Failed to delete product:", error);
                alert('Failed to delete product.');
            }
        }
    };

    const getEntityNameById = (list, id, key, nameKey) => {
        const entity = list.find(item => item[key] == id);
        return entity ? entity[nameKey] : "Unknown";
    };

    if (loading) {
        return <div className="loading-message">Loading products...</div>;
    }

    return (
        <div className="manage-section">
            <h1>Manage Products</h1>
            
            <h2>Product List</h2>
            <table className="management-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Store</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.productId}>
                            <td>{product.productId}</td>
                            <td>{product.productName}</td>
                            <td>${product.price}</td>
                            <td>{product.quantity}</td>
                            <td>{getEntityNameById(stores, product.storeId, 'storeId', 'storeName')}</td>
                            <td>{getEntityNameById(categories, product.categoryId, 'categoryId', 'categoryName')}</td>
                            <td>{getEntityNameById(brands, product.brandId, 'brandId', 'brandName')}</td>
                            <td className="action-buttons">
                                <button className="edit-btn">Edit</button>
                                <button className="delete-btn" onClick={() => handleDeleteProduct(product.productId)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageProducts;