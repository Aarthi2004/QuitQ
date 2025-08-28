import React, { useState, useEffect } from 'react';

const ManageGenders = ({ adminService }) => {
    const [genders, setGenders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGenders();
    }, []);

    const fetchGenders = async () => {
        try {
            const response = await adminService.getGenders();
            if (Array.isArray(response.data)) {
                setGenders(response.data);
            } else {
                console.error("API response for genders is not an array:", response.data);
                setGenders([]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch genders:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (genderId) => {
        if (window.confirm('Are you sure you want to delete this gender option?')) {
            try {
                await adminService.deleteGender(genderId);
                alert('Gender deleted successfully!');
                fetchGenders();
            } catch (error) {
                console.error("Failed to delete gender:", error);
                alert('Failed to delete gender.');
            }
        }
    };

    if (loading) {
        return <div>Loading genders...</div>;
    }

    return (
        <div className="manage-section">
            <h2>Gender List</h2>
            <table className="management-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {genders.map(gender => (
                        <tr key={gender.genderId}>
                            <td>{gender.genderId}</td>
                            <td>{gender.genderName}</td>
                            <td className="action-buttons">
                                <button className="edit-btn">Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(gender.genderId)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageGenders;