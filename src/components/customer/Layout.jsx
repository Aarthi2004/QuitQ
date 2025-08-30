// src/Layout.js

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CustomerServiceContext } from './customer.context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faStore,
    faHeart,
    faBox,
    faUserCircle,
    faShoppingCart,
    faSignOutAlt,
    faSearch,
} from '@fortawesome/free-solid-svg-icons';
import './dashboard/CustomerDashboard.css';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const customerService = useContext(CustomerServiceContext);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchCartCount = async () => {
        try {
            const response = await customerService.getCart();
            if (response.data) setCartItemCount(response.data.length);
        } catch (error) {
            console.error('Failed to fetch cart count:', error);
        }
    };

    useEffect(() => {
        fetchCartCount();
        const updateCart = () => fetchCartCount();
        window.addEventListener('cartUpdated', updateCart);
        return () => window.removeEventListener('cartUpdated', updateCart);
    }, [customerService]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/customer/?search=${searchQuery}`);
        } else {
            navigate('/customer/');
        }
    };

    const handleLogout = () => {
        alert('Logging out...');
        navigate('/login');
    };

    return (
        <div className="main-app-container">
            <header className="main-header">
                <Link to="/customer/" className="brand-title">
                    QuitQ
                </Link>

                <form className="search-form" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Search for products, brands and more..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">
                      
                    </button>
                </form>

                <nav className="header-nav">
                    <Link to="/customer/" className="nav-link">
                        <FontAwesomeIcon icon={faStore} className="icon" />
                        <span className="text">Products</span>
                    </Link>
                    <Link to="/customer/wishlist" className="nav-link">
                        <FontAwesomeIcon icon={faHeart} className="icon" />
                        <span className="text">Wishlist</span>
                    </Link>
                    <Link to="/customer/orders" className="nav-link">
                        <FontAwesomeIcon icon={faBox} className="icon" />
                        <span className="text">Orders</span>
                    </Link>
                    <Link to="/customer/account" className="nav-link">
                        <FontAwesomeIcon icon={faUserCircle} className="icon" />
                        <span className="text">Account</span>
                    </Link>
                    <Link to="/customer/cart" className="nav-link cart-link">
                        <FontAwesomeIcon icon={faShoppingCart} className="icon" />
                        <span className="text">My Cart</span>
                        {cartItemCount > 0 && (
                            <span className="cart-badge">{cartItemCount}</span>
                        )}
                    </Link>
                    <button className="logout-button" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
                        <span className="text">Logout</span>
                    </button>
                </nav>
            </header>

            <main className="main-content-area">
                <div className="page-content-container">{children}</div>
            </main>
        </div>
    );
};

export default Layout;