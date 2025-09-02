import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { resetPasswordAPICall } from './resetPassword.service';
import './ResetPassword.css';

const ResetPassword = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        newPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!credentials.email.trim() || !credentials.newPassword.trim()) {
            toast.error('Please fill in both email and new password fields.');
            return;
        }

        if (credentials.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await resetPasswordAPICall(credentials);
            if (response.data.success) {
                toast.success('Reset password successfully');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                toast.error(response.data.message || 'Failed to reset password.');
            }
        } catch (error) {
            let errorMessage = 'An unexpected error occurred. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="reset-page-container">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="reset-form-card">
                {/* --- ADDED CLOSE BUTTON --- */}
                <Link to="/login" className="close-button">×</Link>
                
                <form onSubmit={handleSubmit}>
                    <h2 className="form-title">Reset Your Password</h2>
                    <p className="form-subtitle">Enter your email and a new secure password.</p>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your registered email"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            placeholder="Enter your new password"
                            value={credentials.newPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="reset-button" disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;