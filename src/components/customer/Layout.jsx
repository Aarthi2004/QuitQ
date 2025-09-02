// src/Layout.js

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
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
import './Layout.css'; // <-- UPDATED CSS IMPORT

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
        if (customerService) {
            fetchCartCount();
            const updateCart = () => fetchCartCount();
            window.addEventListener('cartUpdated', updateCart);
            return () => window.removeEventListener('cartUpdated', updateCart);
        }
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
        // Clear local storage or any other session info here if needed
        localStorage.clear(); 
        navigate('/login');
    };

    return (
        <div className="main-app-container">
            <header className="main-header">
                <NavLink to="/customer/" className="brand-title">
                    QuitQ
                </NavLink>

                <form className="search-form" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </form>

                <nav className="header-nav">
                    <NavLink to="/customer/" end className="nav-link">
                        <FontAwesomeIcon icon={faStore} className="icon" />
                        <span className="text">Products</span>
                    </NavLink>
                    <NavLink to="/customer/wishlist" className="nav-link">
                        <FontAwesomeIcon icon={faHeart} className="icon" />
                        <span className="text">Wishlist</span>
                    </NavLink>
                    <NavLink to="/customer/orders" className="nav-link">
                        <FontAwesomeIcon icon={faBox} className="icon" />
                        <span className="text">Orders</span>
                    </NavLink>
                    <NavLink to="/customer/account" className="nav-link">
                        <FontAwesomeIcon icon={faUserCircle} className="icon" />
                        <span className="text">Account</span>
                    </NavLink>
                    <NavLink to="/customer/cart" className="nav-link cart-link">
                        <FontAwesomeIcon icon={faShoppingCart} className="icon" />
                        <span className="text">My Cart</span>
                        {cartItemCount > 0 && (
                            <span className="cart-badge">{cartItemCount}</span>
                        )}
                    </NavLink>
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