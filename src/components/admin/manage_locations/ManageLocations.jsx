import React, { useState, useEffect } from 'react';

const ManageLocations = ({ adminService }) => {
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const [statesResponse, citiesResponse] = await Promise.allSettled([
                adminService.getStates(),
                adminService.getCities()
            ]);

            // Safely check and set states
            if (statesResponse.status === 'fulfilled' && Array.isArray(statesResponse.value.data)) {
                setStates(statesResponse.value.data);
            } else {
                setStates([]);
                console.error("Failed to fetch states:", statesResponse.reason || "Data format error");
            }
            
            // Safely check and set cities
            if (citiesResponse.status === 'fulfilled' && Array.isArray(citiesResponse.value.data)) {
                setCities(citiesResponse.value.data);
            } else {
                setCities([]);
                console.error("Failed to fetch cities:", citiesResponse.reason || "Data format error");
            }
            
            setLoading(false);
        } catch (error) {
            console.error("An unexpected error occurred during location fetch:", error);
            setLoading(false);
        }
    };

    const handleDeleteState = async (stateId) => {
        if (window.confirm('Deleting a state may affect multiple cities. Are you sure?')) {
            try {
                await adminService.deleteState(stateId);
                alert('State deleted successfully!');
                fetchLocations();
            } catch (error) {
                console.error("Failed to delete state:", error);
                alert('Failed to delete state.');
            }
        }
    };

    const handleDeleteCity = async (cityId) => {
        if (window.confirm('Are you sure you want to delete this city?')) {
            try {
                await adminService.deleteCity(cityId);
                alert('City deleted successfully!');
                fetchLocations();
            } catch (error) {
                console.error("Failed to delete city:", error);
                alert('Failed to delete city.');
            }
        }
    };

    const getStateNameById = (stateId) => {
        const state = states.find(s => s.stateId === stateId);
        return state ? state.stateName : "Unknown";
    };

    if (loading) {
        return <div>Loading locations...</div>;
    }

    return (
        <div className="manage-section">
            <h2>State List</h2>
            <table className="management-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {states.map(state => (
                        <tr key={state.stateId}>
                            <td>{state.stateId}</td>
                            <td>{state.stateName}</td>
                            <td className="action-buttons">
                                <button className="edit-btn">Edit</button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteState(state.stateId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 style={{ marginTop: '2rem' }}>City List</h2>
            <table className="management-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>State</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cities.map(city => (
                        <tr key={city.cityId}>
                            <td>{city.cityId}</td>
                            <td>{city.cityName}</td>
                            <td>{getStateNameById(city.stateId)}</td>
                            <td className="action-buttons">
                                <button className="edit-btn">Edit</button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteCity(city.cityId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageLocations;