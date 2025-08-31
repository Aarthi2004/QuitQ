import React, { useState, useEffect, useContext } from 'react';
import { SellerServiceContext } from '../seller.context';
import ProductForm from '../shared/ProductForm';

const ManageProducts = () => {
    const sellerService = useContext(SellerServiceContext);
    const sellerId = localStorage.getItem("userId");

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [stores, setStores] = useState([]); // This will hold only the seller's stores
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchData = async () => {
        if (!sellerId) {
            setError("Could not find your seller ID. Please log in again.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            
            // Step 1: Get all stores that belong to the logged-in seller
            const userStoresRes = await sellerService.getUserStores(sellerId);
            const userStores = userStoresRes.data || [];
            setStores(userStores);

            // Step 2: If the seller has stores, fetch products for each of them
            if (userStores.length > 0) {
                // This creates an array of promises, one for each store
                const productPromises = userStores.map(store => sellerService.getProductsByStore(store.storeId));
                // This runs all the promises in parallel
                const productResponses = await Promise.all(productPromises);
                // This combines the products from all stores into a single list
                setProducts(productResponses.flatMap(res => res.data || []));
            } else {
                setProducts([]); // If the seller has no stores, they have no products
            }

            // Step 3: Fetch general data needed for the "Add Product" form dropdowns
            const [categoriesRes, brandsRes] = await Promise.all([
                sellerService.getCategories(),
                sellerService.getBrands()
            ]);
            
            setCategories(categoriesRes.data || []);
            setBrands(brandsRes.data || []);
            setError(null);
        } catch (err) {
            setError("Failed to fetch product data. An API endpoint may be missing or the server may be down.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [sellerService, sellerId]); // This will re-run if the logged-in user changes

    const handleFormSubmit = async (formData) => {
        try {
            if (editingProduct) {
                await sellerService.updateProduct(editingProduct.productId, formData);
                alert('Product updated successfully!');
            } else {
                await sellerService.createProduct(formData);
                alert('Product created successfully!');
            }
            setShowForm(false);
            setEditingProduct(null);
            fetchData(); // Re-fetch all data to show the new/updated product
        } catch (err) {
            alert('Failed to save product.');
            console.error(err);
        }
    };
    
    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    if (loading) return <p className="loading-state">Loading product data...</p>;
    if (error) return <p className="error-state">{error}</p>;

    return (
        <div>
            <div className="page-header"><h2 className="page-title">Manage Products</h2></div>
            <div className="seller-card">
                <div className="card-header">
                    <h3 className="card-title">Your Product Listings</h3>
                    {!showForm && <button className="btn btn-primary" onClick={handleAddNew}>Add New Product</button>}
                </div>
                {showForm && (
                    <ProductForm
                        onSubmit={handleFormSubmit}
                        onCancel={() => setShowForm(false)}
                        editingProduct={editingProduct}
                        categories={categories}
                        brands={brands}
                        stores={stores} // Pass the seller's specific stores to the form
                    />
                )}
                <table className="data-table">
                    <thead><tr><th>Name</th><th>Store</th><th>Brand</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.productId}>
                                <td>{p.productName}</td>
                                <td>{stores.find(s => s.storeId === p.storeId)?.storeName || 'N/A'}</td>
                                <td>{brands.find(b => b.brandId === p.brandId)?.brandName || 'N/A'}</td>
                                <td>${p.price.toFixed(2)}</td>
                                <td>{p.quantity > 0 ? p.quantity : <span className="status-badge status-cancelled">Out of Stock</span>}</td>
                                <td><button className="btn btn-secondary btn-sm" onClick={() => handleEdit(p)}>Edit</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default ManageProducts;