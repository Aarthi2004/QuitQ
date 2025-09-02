// src/components/customer/wishlist/Wishlist.js

import React, { useState, useEffect, useContext } from 'react';
import './Wishlist.css'; // Your dedicated CSS file
import { CustomerServiceContext } from '../customer.context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCartPlus } from '@fortawesome/free-solid-svg-icons';

const BACKEND_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Wishlist = () => {
    const customerService = useContext(CustomerServiceContext);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWishlist = async () => {
        if (!customerService) return;
        try {
            const response = await customerService.getWishlist();
            setWishlistItems(response.data || []);
        } catch (err) {
            setError("Failed to fetch wishlist. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [customerService]);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            await customerService.deleteWishlistItem(productId);
            fetchWishlist();
        } catch (error) {
            console.error("Failed to remove from wishlist:", error);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            await customerService.addToCart({ productId, quantity: 1 });
            window.dispatchEvent(new Event('cartUpdated'));
            await handleRemoveFromWishlist(productId);
        } catch (error) {
            console.error("Failed to add to cart:", error);
        }
    };

    if (loading) return <div className="loading-state">Loading Your Wishlist...</div>;
    if (error) return <div className="error-state">{error}</div>;

    return (
        <div className="page-container wishlist-page">
            <h1 className="page-title">Your Wishlist</h1>
            {wishlistItems.length === 0 ? (
                <div className="empty-state">Your wishlist is empty. Explore products to add items!</div>
            ) : (
                <div className="wishlist-grid">
                    {wishlistItems.map(item => (
                        <div key={item.wishListId} className="product-card wishlist-item-card">
                             <div className="product-card-image-container">
                                {/* FIX: Access nested product object */}
                                <img src={`${BACKEND_BASE_URL}${item.product?.productImage}`} alt={item.product?.productName} className="product-image" />
                            </div>
                            <div className="product-details">
                                {/* FIX: Access nested product object */}
                                <h3 className="product-name">{item.product?.productName}</h3>
                                {/* FIX: Access nested product object and safely call toFixed */}
                                <p className="product-price">${item.product?.price?.toFixed(2)}</p>
                                <div className="wishlist-actions">
                                    <button className="wishlist-action-btn add-to-cart-btn" onClick={() => handleAddToCart(item.productId)}>
                                        <FontAwesomeIcon icon={faCartPlus} /> Add to Cart
                                    </button>
                                    <button className="wishlist-action-btn remove-btn" onClick={() => handleRemoveFromWishlist(item.productId)}>
                                        <FontAwesomeIcon icon={faTrashAlt} /> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;