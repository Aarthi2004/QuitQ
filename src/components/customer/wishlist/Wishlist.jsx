import React, { useState, useEffect, useContext } from 'react';
import '../dashboard/CustomerDashboard.css';
import { CustomerServiceContext } from '../customer.context';

const BACKEND_BASE_URL = 'http://localhost:5193';

const Wishlist = () => {
    const customerService = useContext(CustomerServiceContext);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!customerService) {
            setError("Service not available. Please log in.");
            setLoading(false);
            return;
        }
        fetchWishlist();
    }, [customerService]);

    const fetchWishlist = async () => {
        try {
            const response = await customerService.getWishlist();
            setWishlist(response.data || []);
        } catch (err) {
            setError("Failed to fetch wishlist. Please try again later.");
            console.error("Failed to fetch wishlist:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (productId) => {
        try {
            await customerService.deleteWishlistItem(productId);
            fetchWishlist();
            alert('Product removed from wishlist.');
        } catch (error) {
            console.error("Failed to remove from wishlist:", error);
            alert('Failed to remove from wishlist.');
        }
    };

    if (loading) return <div className="loading-state">Loading wishlist...</div>;
    if (error) return <div className="error-state">{error}</div>;

    return (
        <section className="page-section">
            <h2 className="section-title">Your Wishlist</h2>
            {wishlist.length > 0 ? (
                <div className="section-container">
                    <div className="section-content">
                        {wishlist.map(item => (
                            <div className="item-card" key={item.wishlistId}> {/* <-- The key prop is here */}
                                <div className="item-details">
                                    {item.product && (
                                        <img 
                                            src={`${BACKEND_BASE_URL}${item.product.productImage}`} 
                                            alt={item.product.productName} 
                                            className="item-image" 
                                        />
                                    )}
                                    <div className="item-info">
                                        <h3>{item.product?.productName}</h3>
                                    </div>
                                </div>
                                <div className="item-actions">
                                    <button className="remove-btn" onClick={() => handleRemoveFromWishlist(item.productId)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="empty-state">Your wishlist is empty.</div>
            )}
        </section>
    );
};

export default Wishlist;