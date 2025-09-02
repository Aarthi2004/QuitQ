import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home-page-container">
            <div className="home-content">
                <h1 className="home-title">
                    Welcome to QuitQ
                </h1>
                <p className="home-subtitle">
                    Your one-stop destination for everything you need. Discover quality, convenience, and style, all in one place.
                </p>
                <div className="cta-buttons-container">
                    <Link to="/register" className="home-btn primary">Get Started</Link>
                    <Link to="/login" className="home-btn secondary">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;