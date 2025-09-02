import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { registerAPICall } from "./register.service";
import "./Registration.css";

const Registration = () => {
    const [user, setUser] = useState({
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
        dob: "",
        contactNumber: "",
        genderId: 1,
        userStatusId: 1,
        userTypeId: 3,
    });

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: (name === "genderId" || name === "userStatusId" || name === "userTypeId")
                ? Number(value)
                : value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const requiredFields = ['username', 'password', 'email', 'firstName', 'lastName', 'dob', 'contactNumber'];
        for (const field of requiredFields) {
            if (!user[field]?.trim()) {
                toast.error("Please fill in all the required fields.");
                return;
            }
        }
        if (user.password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);
        try {
            const payload = { ...user, dob: `${user.dob}T00:00:00` };
            const response = await registerAPICall(payload);
            
            if (response.data.success) {
                toast.success("Registration successful! Please log in.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                toast.error(response.data.message || "Registration failed.");
            }
        } catch (error) {
            let errorMessage = "An error occurred. Please try again.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Left Branding Panel */}
            <div className="register-branding-panel">
                <div className="branding-content">
                    <h1>Start Your Journey with QuitQ</h1>
                    <p>Discover a world of products and seamless shopping. Creating an account is fast and easy.</p>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="register-form-panel">
                <div className="form-wrapper">
                    <h2>Create Your Account</h2>
                    <p className="form-subtitle">Welcome! Please fill in the details below.</p>
                    
                    <form onSubmit={handleRegister}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input id="firstName" name="firstName" type="text" placeholder="John" value={user.firstName} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input id="lastName" name="lastName" type="text" placeholder="Doe" value={user.lastName} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-row">
                             <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input id="username" name="username" type="text" placeholder="johndoe123" value={user.username} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input id="email" name="email" type="email" placeholder="you@example.com" value={user.email} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="password">Password</label>
                            <input id="password" name="password" type="password" placeholder="Minimum 6 characters" value={user.password} onChange={handleChange} required />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="contactNumber">Contact Number</label>
                                <input id="contactNumber" name="contactNumber" type="tel" placeholder="10-digit number" value={user.contactNumber} onChange={handleChange} required />
                            </div>
                             <div className="form-group">
                                <label htmlFor="dob">Date of Birth</label>
                                <input id="dob" name="dob" type="date" value={user.dob} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="genderId">Gender</label>
                            <select id="genderId" name="genderId" value={user.genderId} onChange={handleChange}>
                                <option value={1}>Male</option>
                                <option value={2}>Female</option>
                                <option value={3}>Other</option>
                            </select>
                        </div>

                        <button type="submit" className="register-button" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                    <div className="switch-auth-link">
                        <span>Already have an account? </span>
                        <Link to="/login">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;