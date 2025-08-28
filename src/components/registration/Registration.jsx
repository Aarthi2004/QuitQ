import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        userTypeId: 3
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

        if (!user.username.trim() || !user.password.trim() || !user.email.trim() ||
            !user.firstName.trim() || !user.lastName.trim() || !user.dob.trim() ||
            !user.contactNumber.trim()) {
            toast.error("Please fill in all the required fields.");
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                ...user,
                dob: user.dob ? `${user.dob}T00:00:00` : null
            };

            console.log("Payload sending to API:", payload);

            const response = await registerAPICall(payload);
            setIsLoading(false);

            if (response.data.success) {
                toast.success("Registration successful, please login");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                toast.error(response.data.message || "Registration failed");
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Registration Error:", error);

            let errorMessage = "Registration failed. Please try again later.";

            if (error.response) {
                if (typeof error.response.data === "object" && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (typeof error.response.data === "object" && error.response.data.errors) {
                    const validationErrors = error.response.data.errors;
                    let validationMessage = "";
                    for (const key in validationErrors) {
                        if (validationErrors.hasOwnProperty(key)) {
                            validationMessage += `${validationErrors[key].join(" ")} `;
                        }
                    }
                    errorMessage = validationMessage.trim() || "Validation failed.";
                } else if (typeof error.response.data === "string") {
                    errorMessage = error.response.data;
                }
            }

            toast.error(errorMessage);
        }
    };

    return (
        <div className="main_registration_container">
            {isLoading ? (
                <div className="loading">
                    <img src="Images/loading.png" alt="Loading" />
                </div>
            ) : (
                <form onSubmit={handleRegister}>
                    <h2 className="form_title">Registration</h2>

                    <div className="form_row">
                        <div className="form_group">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Username"
                                value={user.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form_group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={user.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form_row">
                        <div className="form_group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="First Name"
                                value={user.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form_group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Last Name"
                                value={user.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form_row">
                        <div className="form_group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={user.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form_group">
                            <label htmlFor="contactNumber">Contact Number</label>
                            <input
                                id="contactNumber"
                                name="contactNumber"
                                type="tel"
                                placeholder="Contact Number"
                                value={user.contactNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form_row">
                        <div className="form_group">
                            <label htmlFor="dob">Date of Birth</label>
                            <input
                                id="dob"
                                name="dob"
                                type="date"
                                placeholder="Date of Birth"
                                value={user.dob}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form_group">
                            <label htmlFor="genderId">Gender</label>
                            <select
                                id="genderId"
                                name="genderId"
                                value={user.genderId}
                                onChange={handleChange}
                            >
                                <option value={1}>Male</option>
                                <option value={2}>Female</option>
                                <option value={3}>Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="form_row">
                        <div className="form_group">
                            <label htmlFor="userTypeId">User Type</label>
                            <select
                                id="userTypeId"
                                name="userTypeId"
                                value={user.userTypeId}
                                onChange={handleChange}
                            >
                                <option value={1}>Admin</option>
                                <option value={2}>Seller</option>
                                <option value={3}>Customer</option>
                            </select>
                        </div>
                        <div className="form_group">
                            <label htmlFor="userStatusId">User Status</label>
                            <select
                                id="userStatusId"
                                name="userStatusId"
                                value={user.userStatusId}
                                onChange={handleChange}
                            >
                                <option value={1}>Active</option>
                                <option value={2}>Inactive</option>
                                <option value={3}>Banned</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit">Register</button>
                </form>
            )}
            <ToastContainer />
        </div>
    );
};

export default Registration;