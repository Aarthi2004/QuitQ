// src/components/customer/cart/Cart.js

import React, { useState, useEffect, useContext } from 'react';
import './Cart.css'; // Your dedicated CSS file
import { CustomerServiceContext } from '../customer.context';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const BACKEND_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Cart = () => {
    const customerService = useContext(CustomerServiceContext);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCart = async () => {
        if (!customerService) return;
        setLoading(true);
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
    
    useEffect(() => {
        fetchCart();
    }, [customerService]);

    const handleQuantityChange = async (cartId, action) => {
        try {
            const apiCall = action === 'increase' ? customerService.increaseQuantity : customerService.decreaseQuantity;
            await apiCall(cartId);
            fetchCart();
        } catch (error) {
            console.error(`Failed to change quantity:`, error);
        }
    };

    const handleRemoveFromCart = async (cartId) => {
        try {
            await customerService.deleteCartItem(cartId);
            fetchCart();
        } catch (error) {
            console.error("Failed to remove from cart:", error);
        }
    };
    
    const handlePlaceOrder = async () => {
        if (!userId) {
            alert("You must be logged in to place an order.");
            return;
        }
        try {
            await customerService.placeOrder({ userId: parseInt(userId), paymentMethod: 'COD' });
            alert('Order placed successfully!');
            navigate('/customer/orders');
        } catch (error) {
            console.error("Failed to place order:", error);
            alert('Failed to place order.');
        }
    };

    const calculateTotal = () => {
        // FIX: Use productPrice for calculation
        return cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0).toFixed(2);
    };

    if (loading) return <div className="loading-state">Loading Cart...</div>;
    if (error) return <div className="error-state">{error}</div>;

    return (
        <div className="page-container cart-page">
            <h1 className="page-title">Your Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="empty-state">Your cart is currently empty.</div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-items-list">
                        {cartItems.map(item => (
                            <div key={item.cartId} className="item-card">
                                <img src={`${BACKEND_BASE_URL}${item.productImage}`} alt={item.productName} className="item-image" />
                                <div className="item-details">
                                    {/* FIX: Use productName */}
                                    <h3 className="item-name">{item.productName}</h3>
                                    {/* FIX: Use productPrice */}
                                    <p className="item-price">${item.productPrice?.toFixed(2)}</p>
                                    <div className="quantity-controls">
                                        <button onClick={() => handleQuantityChange(item.cartId, 'decrease')}><FontAwesomeIcon icon={faMinus} /></button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item.cartId, 'increase')}><FontAwesomeIcon icon={faPlus} /></button>
                                    </div>
                                </div>
                                <div className="item-actions">
                                     {/* FIX: Use productPrice */}
                                    <p className="item-subtotal">${(item.productPrice * item.quantity).toFixed(2)}</p>
                                    <button className="remove-btn icon-btn" title="Remove Item" onClick={() => handleRemoveFromCart(item.cartId)}>
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <aside className="order-summary-card">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${calculateTotal()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>FREE</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>${calculateTotal()}</span>
                        </div>
                        <button className="checkout-btn" onClick={handlePlaceOrder}>Proceed to Checkout</button>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default Cart;