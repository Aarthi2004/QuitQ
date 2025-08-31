import React, { useState, useEffect } from 'react';

const ProductForm = ({ onSubmit, onCancel, editingProduct, categories, brands, stores }) => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [storeId, setStoreId] = useState('');
  const [productImageFile, setProductImageFile] = useState(null);

  useEffect(() => {
    if (editingProduct) {
      setProductName(editingProduct.productName || '');
      setPrice(editingProduct.price || '');
      setQuantity(editingProduct.quantity || '');
      setCategoryId(editingProduct.categoryId || '');
      setBrandId(editingProduct.brandId || '');
      setStoreId(editingProduct.storeId || '');
      setProductImageFile(null);
    } else {
      setProductName(''); setPrice(''); setQuantity(''); setCategoryId('');
      setBrandId(''); setStoreId(''); setProductImageFile(null);
    }
  }, [editingProduct]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('categoryId', categoryId);
    formData.append('brandId', brandId);
    formData.append('storeId', storeId);
    if (productImageFile) {
      formData.append('productImageFile', productImageFile);
    }
    onSubmit(formData);
  };

  return (
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
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{editingProduct ? 'Update Product' : 'Create Product'}</button>
      </div>
    </form>
  );
};
export default ProductForm;