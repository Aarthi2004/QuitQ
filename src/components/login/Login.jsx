import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginAPICall } from './login.service';
import './Login.css';

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (!credentials.username || !credentials.password) {
            toast.error('Username and password are required.');
            return;
        }

        setIsLoading(true);
        loginAPICall(credentials)
            .then((response) => {
                const data = response.data;
                if (data && data.token && data.role && data.userId) {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('role', data.role);
                    localStorage.setItem('userId', data.userId);
                    toast.success('Login successful! Redirecting...');

                    setTimeout(() => {
                        if (data.role === 'Admin') navigate('/admin-dashboard');
                        else if (data.role === 'Seller') navigate('/seller-dashboard');
                        else if (data.role === 'Customer') navigate('/customer');
                        else navigate('/');
                    }, 1500);

                } else {
                    throw new Error('Invalid server response.');
                }
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
                toast.error(errorMessage);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="login-page-container">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            
            <div className="login-branding-panel">
                <div className="branding-content">
                    <h1>Welcome Back to QuitQ</h1>
                    <p>Your ultimate destination for seamless shopping. Log in to continue.</p>
                </div>
            </div>

            <div className="login-form-panel">
                <div className="form-container">
                    <div className="form-header">
                        <h2>Sign In</h2>
                        <p>Welcome back! Please enter your details.</p>
                    </div>
                    
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                className="form-input"
                                value={credentials.username}
                                onChange={handleChange}
                                placeholder=" " /* Must have a placeholder for the animation to work */
                                required
                            />
                            <label htmlFor="username" className="form-label">Username</label>
                        </div>
                        
                        <div className="form-group">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className="form-input"
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder=" " /* Must have a placeholder for the animation to work */
                                required
                            />
                            <label htmlFor="password" className="form-label">Password</label>
                        </div>
                        
                        <div className="form-options">
                            <Link to="/reset-password" className="forgot-password-link">Forgot Password?</Link>
                        </div>
                        
                        <button type="submit" className="login-button" disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                    
                    <div className="signup-prompt">
                        <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;