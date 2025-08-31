import React, { useState, useEffect, useContext } from 'react';
import '../dashboard/CustomerDashboard.css'; // Corrected Path
import { CustomerServiceContext } from '../customer.context';
import { useNavigate } from 'react-router-dom';

const BACKEND_BASE_URL = 'http://localhost:5193';

const Cart = () => {
    const customerService = useContext(CustomerServiceContext);
    const navigate = useNavigate();
    
    // Get the dynamic userId from localStorage
    const userId = localStorage.getItem("userId");

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!customerService) return;
        
        const fetchCart = async () => {
            try {
                // The backend identifies the user via the JWT token for getting the cart
                const response = await customerService.getCart();
                setCartItems(response.data || []);
            } catch (err) {
                setError("Failed to fetch cart. Please log in.");
                console.error("Failed to fetch cart:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [customerService]);

    const handleIncreaseQuantity = async (cartId) => {
        try {
            await customerService.increaseQuantity(cartId);
            const response = await customerService.getCart();
            setCartItems(response.data || []);
        } catch (error) {
            console.error("Failed to increase quantity:", error);
            alert('Failed to increase quantity.');
        }
    };

    const handleDecreaseQuantity = async (cartId) => {
        try {
            await customerService.decreaseQuantity(cartId);
            const response = await customerService.getCart();
            setCartItems(response.data || []);
        } catch (error) {
            console.error("Failed to decrease quantity:", error);
            alert('Failed to decrease quantity.');
        }
    };

    const handleRemoveFromCart = async (cartId) => {
        try {
            await customerService.deleteCartItem(cartId);
            const response = await customerService.getCart();
            setCartItems(response.data || []);
            alert('Product removed from cart.');
        } catch (error) {
            console.error("Failed to remove from cart:", error);
            alert('Failed to remove from cart.');
        }
    };
    
    const handlePlaceOrder = async () => {
        if (!userId) {
            alert("You must be logged in to place an order.");
            return;
        }
        try {
            // Use the dynamic userId when placing the order
            await customerService.placeOrder({ userId: userId });
            alert('Order placed successfully!');
            navigate('/customer/orders');
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