// src/dashboard/CustomerDashboard.js

import React, { useState, useEffect, useContext } from 'react';
import './CustomerDashboard.css';
import { CustomerServiceContext } from '../customer.context';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCartPlus, faHeart, faTag } from '@fortawesome/free-solid-svg-icons';

const BACKEND_BASE_URL = 'http://localhost:5193';

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
        rating: (Math.random() * (5 - 3) + 3).toFixed(1), // Realistic dummy rating
        isBestseller: Math.random() > 0.8
    };
};

// Revamped ProductCard component with animations
const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
    return (
        <div className="product-card">
            <div className="product-card-image-container">
                <img src={product.imageUrl} alt={product.name} className="product-image" />
                <div className="product-actions-overlay">
                    <button className="icon-button" onClick={() => onAddToCart(product.id)}>
                        <FontAwesomeIcon icon={faCartPlus} />
                    </button>
                    <button className="icon-button" onClick={() => onAddToWishlist(product.id)}>
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
                        <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}
                        />
                    ))}
                    <span className="rating-text">({product.rating})</span>
                </div>
                <p className="product-price">${product.price.toFixed(2)}</p>
            </div>
        </div>
    );
};

const CustomerDashboard = () => {
    const customerService = useContext(CustomerServiceContext);
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            if (!customerService) {
                setError("Service not available. Please log in.");
                setLoading(false);
                return;
            }
            try {
                const searchParams = new URLSearchParams(location.search);
                const searchQuery = searchParams.get('search');
                
                let response;
                if (searchQuery) {
                    response = await customerService.searchProducts(searchQuery);
                } else {
                    response = await customerService.getProducts();
                }

                setProducts(response.data && Array.isArray(response.data) ? response.data.map(getProductDetails) : []);
            } catch (err) {
                setError("Failed to fetch products. Please try again later.");
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [customerService, location.search]);

    const handleAddToCart = async (productId) => {
        try {
            await customerService.addToCart({ productId, quantity: 1 });
            showToast('Product added to cart!', 'success');
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error("Failed to add to cart:", error);
            showToast('Failed to add to cart.', 'danger');
        }
    };

    const handleAddToWishlist = async (productId) => {
        try {
            await customerService.addToWishlist({ userId: 8, productId });
            showToast('Product added to wishlist!', 'success');
        } catch (error) {
            console.error("Failed to add to wishlist:", error);
            showToast('Failed to add to wishlist.', 'danger');
        }
    };

    if (loading) return <div className="loading-state">Loading your dashboard...</div>;
    if (error) return <div className="error-state">{error}</div>;

    return (
        <>
            <div className="page-banner">
                <h2 className="banner-title">Discover Your Next Favorite.</h2>
                <p className="banner-subtitle">Curated for you. Explore our new arrivals and top selections.</p>
            </div>
            <section className="product-section">
                <h2 className="section-title">Featured Products</h2>
                <div className="product-grid">
                    {products.length > 0 ? (
                        products.map(product => (
                            <ProductCard 
                                key={product.id}
                                product={product}
                                onAddToCart={handleAddToCart}
                                onAddToWishlist={handleAddToWishlist}
                            />
                        ))
                    ) : (
                        <div className="no-products"><p>No products found at this time.</p></div>
                    )}
                </div>
            </section>
            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />
                ))}
            </div>
        </>
    );
};

export default CustomerDashboard;