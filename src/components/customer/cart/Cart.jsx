import React, { useState, useEffect, useContext } from 'react';
import '../dashboard/CustomerDashboard.css';
import { CustomerServiceContext } from '../customer.context';
import { useNavigate } from 'react-router-dom';

const BACKEND_BASE_URL = 'http://localhost:5193';
const CURRENT_USER_ID = 8;

const Cart = () => {
    const customerService = useContext(CustomerServiceContext);
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!customerService) return;
        fetchCart();
    }, [customerService]);

    const fetchCart = async () => {
        try {
            const response = await customerService.getCart();
            setCartItems(response.data || []);
        } catch (err) {
            setError("Failed to fetch cart. Please log in.");
            console.error("Failed to fetch cart:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleIncreaseQuantity = async (cartId) => {
        try {
            await customerService.increaseQuantity(cartId);
            fetchCart();
        } catch (error) {
            console.error("Failed to increase quantity:", error);
            alert('Failed to increase quantity.');
        }
    };

    const handleDecreaseQuantity = async (cartId) => {
        try {
            await customerService.decreaseQuantity(cartId);
            fetchCart();
        } catch (error) {
            console.error("Failed to decrease quantity:", error);
            alert('Failed to decrease quantity.');
        }
    };

    const handleRemoveFromCart = async (cartId) => {
        try {
            await customerService.deleteCartItem(cartId);
            fetchCart();
            alert('Product removed from cart.');
        } catch (error) {
            console.error("Failed to remove from cart:", error);
            alert('Failed to remove from cart.');
        }
    };
    
    const handlePlaceOrder = async () => {
        try {
            await customerService.placeOrder({ userId: CURRENT_USER_ID });
            alert('Order placed successfully!');
            navigate('orders');
        } catch (error) {
            console.error("Failed to place order:", error);
            alert('Failed to place order.');
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0).toFixed(2);
    };

    if (loading) return <div className="loading-state">Loading cart...</div>;
    if (error) return <div className="error-state">{error}</div>;

    return (
        <section className="page-section">
            <h2 className="section-title">Your Shopping Cart</h2>
            {cartItems.length > 0 ? (
                <div className="section-container">
                    <div className="section-content">
                        {cartItems.map(item => (
                            <div className="item-card" key={item.cartId}>
                                <div className="item-details">
                                    <img src={`${BACKEND_BASE_URL}${item.productImage}`} alt={item.productName} className="item-image" />
                                    <div className="item-info">
                                        <h3>{item.productName}</h3>
                                        <p>Price: ${item.productPrice.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="item-actions">
                                    <div className="quantity-controls">
                                        <button onClick={() => handleDecreaseQuantity(item.cartId)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleIncreaseQuantity(item.cartId)}>+</button>
                                    </div>
                                    <button className="remove-btn" onClick={() => handleRemoveFromCart(item.cartId)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="checkout-area">
                        <h3 className="cart-total-price">Total: ${calculateTotal()}</h3>
                        <button className="checkout-btn" onClick={handlePlaceOrder}>Checkout</button>
                    </div>
                </div>
            ) : (
                <div className="empty-state">Your cart is empty.</div>
            )}
        </section>
    );
};

export default Cart;