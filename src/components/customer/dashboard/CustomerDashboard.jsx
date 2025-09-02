// src/dashboard/CustomerDashboard.js

import React, { useState, useEffect, useContext, useCallback } from 'react';
import './CustomerDashboard.css';
import { CustomerServiceContext } from '../customer.context';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCartPlus, faHeart, faTag, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

const BACKEND_BASE_URL = 'http://localhost:5193';

// Toast and ProductCard components remain the same...
const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-content">{message}</div>
        </div>
    );
};

const getProductDetails = (product) => {
    const imageUrl = product.productImage
        ? `${BACKEND_BASE_URL}${product.productImage}`
        : 'https://via.placeholder.com/250x250.png?text=No+Image';
    return {
        id: product.productId,
        name: product.productName,
        price: product.price,
        imageUrl: imageUrl,
        rating: (Math.random() * (5 - 3) + 3).toFixed(1),
        isBestseller: Math.random() > 0.8
    };
};

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => (
    <div className="product-card">
        <div className="product-card-image-container">
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <div className="product-actions-overlay">
                <button className="icon-button" title="Add to Cart" onClick={() => onAddToCart(product.id)}>
                    <FontAwesomeIcon icon={faCartPlus} />
                </button>
                <button className="icon-button" title="Add to Wishlist" onClick={() => onAddToWishlist(product.id)}>
                    <FontAwesomeIcon icon={faHeart} />
                </button>
            </div>
        </div>
        <div className="product-details">
            {product.isBestseller && (
                <div className="product-badge">
                    <FontAwesomeIcon icon={faTag} /> Bestseller
                </div>
            )}
            <h3 className="product-name">{product.name}</h3>
            <div className="product-rating">
                {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'} />
                ))}
                <span className="rating-text">({product.rating})</span>
            </div>
            <p className="product-price">${product.price.toFixed(2)}</p>
        </div>
    </div>
);


const CustomerDashboard = () => {
    const customerService = useContext(CustomerServiceContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toasts, setToasts] = useState([]);

    const [allBrands, setAllBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({ minPrice: 0, maxPrice: 1000, brandId: '', categoryId: '' });
    const [activeBrandId, setActiveBrandId] = useState(null);
    
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [brandsRes, categoriesRes] = await Promise.all([
                    customerService.getBrands(),
                    customerService.getCategories(),
                ]);
                setAllBrands(brandsRes.data);
                setCategories(categoriesRes.data);
            } catch (err) {
                console.error("Failed to load initial data:", err);
                showToast("Could not load page options.", "danger");
            }
        };
        if (customerService) {
            loadInitialData();
        }
    }, [customerService]);

    const fetchProducts = useCallback(async () => {
        if (!customerService) {
            setError("Service not available.");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const searchParams = new URLSearchParams(location.search);
            const searchQuery = searchParams.get('search');
            let response;

            const hasActiveFilters = filters.brandId || filters.categoryId || filters.minPrice > 0 || filters.maxPrice < 1000;

            if (searchQuery) {
                setActiveBrandId(null);
                response = await customerService.searchProducts(searchQuery);
            } else if (activeBrandId) {
                response = await customerService.filterProducts({ brandId: activeBrandId });
            } else if (hasActiveFilters) {
                 const filterPayload = {
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice,
                    brandId: filters.brandId ? parseInt(filters.brandId, 10) : null,
                    categoryId: filters.categoryId ? parseInt(filters.categoryId, 10) : null,
                };
                response = await customerService.filterProducts(filterPayload);
            } else {
                response = await customerService.getProducts();
            }

            setProducts(response.data?.map(getProductDetails) ?? []);
        } catch (err) {
            setError("Failed to fetch products. Please try again later.");
            console.error("Failed to fetch products:", err);
        } finally {
            setLoading(false);
        }
    }, [customerService, location.search, activeBrandId, filters]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };
    
    // handleAddToCart and handleAddToWishlist are unchanged...
    const handleAddToCart = async (productId) => {
        try {
            await customerService.addToCart({ productId, quantity: 1 });
            showToast('Product added to cart!', 'success');
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error("Failed to add to cart:", error);
            showToast(error.response?.data?.message || 'Failed to add to cart.', 'danger');
        }
    };

    const handleAddToWishlist = async (productId) => {
        try {
            await customerService.addToWishlist({ productId });
            showToast('Product added to wishlist!', 'success');
        } catch (error) {
            console.error("Failed to add to wishlist:", error);
            showToast(error.response?.data?.message || 'Failed to add to wishlist.', 'danger');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setActiveBrandId(null); 
    };

    const handleBrandClick = (brandId) => {
        // --- THIS IS THE FIX FOR THE LOGOUT BUG ---
        navigate('/customer/'); 
        setFilters({ minPrice: 0, maxPrice: 1000, brandId: '', categoryId: '' }); 
        setActiveBrandId(brandId);
    };

    const handleClearFilters = () => {
        setFilters({ minPrice: 0, maxPrice: 1000, brandId: '', categoryId: '' });
        setActiveBrandId(null);
    };

    return (
        <>
            <div className="page-banner">
                <h2 className="banner-title">Discover Your Next Favorite.</h2>
                <p className="banner-subtitle">Curated for you. Explore our new arrivals and top selections.</p>
            </div>
            
            <section className="brand-section">
                <h2 className="section-title">Shop by Brand</h2>
                <div className="brand-carousel-container">
                    <div className="brand-grid">
                        {/* We duplicate the array for a seamless infinite scroll effect */}
                        {[...allBrands, ...allBrands].map((brand, index) => (
                            <div key={`${brand.brandId}-${index}`} className="brand-card" onClick={() => handleBrandClick(brand.brandId)}>
                                <div className="brand-logo-container">
                                    <img src={`${BACKEND_BASE_URL}${brand.brandLogo}`} alt={brand.brandName} />
                                </div>
                                <div className="brand-name">{brand.brandName}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="product-display-section">
                <aside className="filter-panel">
                    <h3 className="filter-title"><FontAwesomeIcon icon={faFilter} /> Filters</h3>
                    <div className="filter-group">
                        <label>Price Range</label>
                        <div className="price-range-inputs">
                            <span>${filters.minPrice}</span> - <span>${filters.maxPrice}</span>
                        </div>
                        <input type="range" name="maxPrice" min="0" max="1000" value={filters.maxPrice} onChange={handleFilterChange} className="price-slider"/>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="brandId">Brand</label>
                        <select name="brandId" id="brandId" value={filters.brandId} onChange={handleFilterChange}>
                            <option value="">All Brands</option>
                            {allBrands.map(brand => <option key={brand.brandId} value={brand.brandId}>{brand.brandName}</option>)}
                        </select>
                    </div>
                     <div className="filter-group">
                        <label htmlFor="categoryId">Category</label>
                        <select name="categoryId" id="categoryId" value={filters.categoryId} onChange={handleFilterChange}>
                            <option value="">All Categories</option>
                            {categories.map(cat => <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>)}
                        </select>
                    </div>
                    <button className="clear-filters-btn" onClick={handleClearFilters}>
                        <FontAwesomeIcon icon={faTimes} /> Clear All
                    </button>
                </aside>

                <main className="product-section">
                    <div className="product-grid">
                        {loading && <div className="loading-state">Fetching products...</div>}
                        {error && <div className="error-state">{error}</div>}
                        {!loading && !error && products.length > 0 ? (
                            products.map(product => (
                                <ProductCard 
                                    key={product.id}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                    onAddToWishlist={handleAddToWishlist}
                                />
                            ))
                        ) : (
                            !loading && <div className="no-products"><p>No products found matching your criteria.</p></div>
                        )}
                    </div>
                </main>
            </section>

            <div className="toast-container">
                {toasts.map(({ id, message, type }) => (
                    <Toast key={id} message={message} type={type} onClose={() => setToasts(p => p.filter(t => t.id !== id))} />
                ))}
            </div>
        </>
    );
};

export default CustomerDashboard;