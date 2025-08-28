import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { loginAPICall } from "./login.service";
import { LoginModel } from "./login.model";
import { LoginErrorModel } from "./loginerror.model";
import "./Login.css";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(new LoginModel());
    const [errors, setErrors] = useState(new LoginErrorModel());
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));

        if (name === "username" && value.trim() === "") {
            setErrors((prev) => ({ ...prev, username: "Username cannot be empty" }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (errors.username.length > 0) return;

        setIsLoading(true);
        loginAPICall(user)
            .then((response) => {
                setIsLoading(false);
                const data = response.data;

                if (data && data.token && data.role) {
                    localStorage.setItem("authToken", data.token); 
                    localStorage.setItem("username", data.username);
                    localStorage.setItem("role", data.role);
                    toast.success("Login successful");

                    if (data.role === "Seller") {
                        navigate("/seller-dashboard");
                    } else if (data.role === "Admin") {
                        navigate("/admin-dashboard");
                    } else if (data.role === "Customer") {
                        navigate("/customer-dashboard");
                    } else {
                        navigate("/");
                    }
                } else {
                    toast.error("Invalid credentials or missing role");
                }
            })
            .catch((error) => {
                setIsLoading(false);
                toast.error("Login failed");
                console.error(error);
            });
    };

    return (
        <div className="main_login_form">
            {isLoading ? (
                <div className="loading">
                    <img src="Images/loading.png" alt="Loading" />
                </div>
            ) : (
                <form onSubmit={handleLogin}>
                    <input
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        type="text"
                        placeholder="username"
                        autoComplete="username"
                    />
                    {errors.username?.length > 0 && (
                        <span className="alert alert-danger">{errors.username}</span>
                    )}
                    <input
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="password"
                        autoComplete="current-password"
                    />
                    <button type="submit">Log In!</button>
                    <div className="lined">
                        <div>New User?</div>
                        <Link to="/register">
                            <button type="button" className="btn-link">Register</button>
                        </Link>
                        <div>Forgot Password?</div>
                        <Link to="/resetpassword">
                            <button type="button" className="btn-link">Forgot password</button>
                        </Link>
                    </div>
                </form>
            )}
            <ToastContainer />
        </div>
    );
};

export default Login;