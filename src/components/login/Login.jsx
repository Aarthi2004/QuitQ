import "./Login.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { loginAPICall } from "../../services/login.service";
import { LoginModel } from "../../models/login.model";
import { LoginErrorModel } from "../../models/loginerror.model";

const Login = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(new LoginModel());
    const [errors, setErrors] = useState(new LoginErrorModel());
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
        // Basic validation
        if(name === "username" && value === "") {
            setErrors((prev) => ({ ...prev, username: "Username cannot be empty" }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if(errors.username.length > 0) return;
        setIsLoading(true);
        loginAPICall(user)
            .then((response) => {
                setIsLoading(false);
                const data = response.data;
                if(data && data.token) {
                    sessionStorage.setItem("token", data.token);
                    sessionStorage.setItem("username", data.username);
                    toast.success("Login success");
                    navigate("/");
                } else {
                    toast.error("Invalid credentials");
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
                    <div className="login_form">
                        <input
                            className="login_form_items"
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
                            className="login_form_items"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            type="password"
                            placeholder="password"
                            autoComplete="current-password"
                        />
                        <button className="login_form_items" type="submit">Log In!</button>
                        <div className="lined">
                            <div className="login_form_items">New User?</div>
                            <button
                                type="button"
                                style={{ backgroundColor: "royalblue" }}
                                className="login_form_items"
                                onClick={props?.toggle}
                            >
                                Register
                            </button>
                            <div className="login_form_items">Forgot Password?</div>
                            <button type="button" style={{ backgroundColor: "royalblue" }}>
                                <Link to="/resetpassword" style={{ textDecoration: "none", color: "inherit" }}>
                                    Forgot password
                                </Link>
                            </button>
                        </div>
                    </div>
                </form>
            )}
            <ToastContainer />
        </div>
    );
};

export default Login;
