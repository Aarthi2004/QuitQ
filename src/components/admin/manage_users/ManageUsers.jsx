import React, { useState, useEffect } from 'react';

const ManageUsers = ({ adminService }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    const roleMap = { 1: "Admin", 2: "Manager", 3: "User" };
    const genderMap = { 1: "Male", 2: "Female", 3: "Other" };
    const statusMap = { 1: "Active", 2: "Inactive", 3: "Banned" };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await adminService.getUsers();
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                console.error("API response for users is not an array:", response.data);
                setUsers([]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await adminService.deleteUser(userId);
                alert('User deleted successfully!');
                fetchUsers();
            } catch (error) {
                console.error("Failed to delete user:", error);
                alert('Failed to delete user.');
            }
        }
    };

    if (loading) {
        return <div>Loading users...</div>;
    }

    return (
        <div className="manage-section">
            <h2>User List</h2>
            <table className="management-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr 
                            key={user.userId} 
                            onClick={() => setSelectedUser(user)} 
                            style={{ cursor: "pointer" }}
                        >
                            <td>{user.userId}</td>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{roleMap[user.userTypeId] || "Unknown"}</td>
                            <td className="action-buttons">
                                <button 
                                    className="delete-btn" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(user.userId);
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedUser && (
                <div className="user-details-overlay">
                    <div className="user-details-card">
                        <h3>User Details</h3>
                        <p><strong>ID:</strong> {selectedUser.userId}</p>
                        <p><strong>Username:</strong> {selectedUser.username}</p>
                        <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>DOB:</strong> {new Date(selectedUser.dob).toLocaleDateString()}</p>
                        <p><strong>Contact:</strong> {selectedUser.contactNumber}</p>
                        <p><strong>Role:</strong> {roleMap[selectedUser.userTypeId]}</p>
                        <p><strong>Gender:</strong> {genderMap[selectedUser.genderId]}</p>
                        <p><strong>Status:</strong> {statusMap[selectedUser.userStatusId]}</p>
                        <button onClick={() => setSelectedUser(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;