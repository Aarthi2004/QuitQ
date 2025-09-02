import React, { useState, useEffect } from 'react';

const ProductForm = ({ onSubmit, onCancel, editingProduct, categories, brands, stores, sellerService }) => {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [subcategoryId, setSubcategoryId] = useState('');
    const [brandId, setBrandId] = useState('');
    const [storeId, setStoreId] = useState('');
    const [productImageFile, setProductImageFile] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [loadingSubcategories, setLoadingSubcategories] = useState(false);

    useEffect(() => {
        if (editingProduct) {
            setProductName(editingProduct.productName || '');
            setPrice(editingProduct.price || '');
            setQuantity(editingProduct.quantity || '');
            setCategoryId(editingProduct.categoryId || '');
            setSubcategoryId(editingProduct.subcategoryId || '');
            setBrandId(editingProduct.brandId || '');
            setStoreId(editingProduct.storeId || '');
            setProductImageFile(null);
        } else {
            setProductName(''); setPrice(''); setQuantity('');
            setCategoryId(''); setSubcategoryId(''); setBrandId('');
            setStoreId(''); setProductImageFile(null);
        }
    }, [editingProduct]);

    useEffect(() => {
        const fetchSubcategories = async () => {
            if (!categoryId) {
                setSubcategories([]);
                setSubcategoryId('');
                return;
            }
            try {
                setLoadingSubcategories(true);
                const res = await sellerService.getSubcategoriesByCategoryId(categoryId);
                setSubcategories(res.data || []);
            } catch (err) {
                console.error("Failed to fetch subcategories:", err);
                setSubcategories([]);
            } finally {
                setLoadingSubcategories(false);
            }
        };

        fetchSubcategories();
    }, [categoryId, sellerService]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('categoryId', categoryId);
        formData.append('subcategoryId', subcategoryId);
        formData.append('brandId', brandId);
        formData.append('storeId', storeId);
        if (productImageFile) {
            formData.append('productImageFile', productImageFile);
        }
        onSubmit(formData);
    };

    return (
        <div className="product-form-container">
            <button className="close-btn" onClick={onCancel}>&times;</button>
            <form className="product-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="productName">Product Name</label>
                    <input id="productName" type="text" className="form-input" value={productName} onChange={e => setProductName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="storeId">Store</label>
                    <select id="storeId" className="form-select" value={storeId} onChange={e => setStoreId(e.target.value)} required>
                        <option value="">Select Store</option>
                        {stores.map(s => <option key={s.storeId} value={s.storeId}>{s.storeName}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="categoryId">Category</label>
                    <select id="categoryId" className="form-select" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="subcategoryId">Subcategory</label>
                    <select 
                        id="subcategoryId" 
                        className="form-select" 
                        value={subcategoryId} 
                        onChange={e => setSubcategoryId(e.target.value)} 
                        required={!!categoryId}
                        disabled={!categoryId}
                    >
                        <option value="">
                            {loadingSubcategories ? 'Loading...' : 'Select Subcategory'}
                        </option>
                        {subcategories.map(sc => <option key={sc.subcategoryId} value={sc.subCategoryId}>{sc.subCategoryName}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="brandId">Brand</label>
                    <select id="brandId" className="form-select" value={brandId} onChange={e => setBrandId(e.target.value)} required>
                        <option value="">Select Brand</option>
                        {brands.map(b => <option key={b.brandId} value={b.brandId}>{b.brandName}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price ($)</label>
                    <input id="price" type="number" step="0.01" className="form-input" value={price} onChange={e => setPrice(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Stock Quantity</label>
                    <input id="quantity" type="number" className="form-input" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                </div>
                <div className="form-group full-width">
                    <label htmlFor="productImageFile">Product Image</label>
                    <div className="form-file-input-wrapper">
                        <input id="productImageFile" type="file" className="form-file-input" onChange={e => setProductImageFile(e.target.files[0])} />
                        <span className="form-file-input-label">
                            {productImageFile ? 'File selected!' : 'Click to upload an image'}
                        </span>
                    </div>
                    {productImageFile && <span className="file-name">{productImageFile.name}</span>}
                </div>
                <div className="form-actions-centered">
                    <button type="submit" className="btn btn-primary">{editingProduct ? 'Update Product' : 'Create Product'}</button>
                </div>
            </form>
        </div>
    );
};
export default ProductForm;
