import React, { useState, useEffect } from 'react';
import { 
    FaBoxes, FaStore, FaTags, FaUsers, FaMapMarkedAlt, 
    FaGenderless, FaClipboardList, FaTruck, FaSignOutAlt 
} from 'react-icons/fa';
import './AdminDashboard.css';

// ✅ Use default instance directly
import adminService from './admin.service';

// Import sub-components
import ManageUsers from './manage_users/ManageUsers';
import ManageProducts from './manage_products/ManageProducts';
import ManageStores from './manage_stores/ManageStores';
import ManageCategories from './manage_categories/ManageCategories';
import ManageBrands from './manage_brands/ManageBrands';
import ManageLocations from './manage_locations/ManageLocations';
import ManageGenders from './manage_genders/ManageGenders';
import ManageOrders from './manage_orders/ManageOrders';
import ManageShippers from './manage_shippers/ManageShippers';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, products: 0, stores: 0, categories: 0, orders: 0, shippers: 0 });
    const [activeSection, setActiveSection] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [
                    usersResponse,
                    productsResponse,
                    storesResponse,
                    categoriesResponse,
                    ordersResponse,
                    shippersResponse
                ] = await Promise.allSettled([
                    adminService.getUsers(),
                    adminService.getProducts(),
                    adminService.getStores(),
                    adminService.getCategories(),
                    adminService.getAllOrders(),
                    adminService.getShippers()
                ]);

                setStats({
                    users: usersResponse.status === 'fulfilled' ? (usersResponse.value.data?.length || 0) : 0,
                    products: productsResponse.status === 'fulfilled' ? (productsResponse.value.data?.length || 0) : 0,
                    stores: storesResponse.status === 'fulfilled' ? (storesResponse.value.data?.length || 0) : 0,
                    categories: categoriesResponse.status === 'fulfilled' ? (categoriesResponse.value.data?.length || 0) : 0,
                    orders: ordersResponse.status === 'fulfilled' ? (ordersResponse.value.data?.length || 0) : 0,
                    shippers: shippersResponse.status === 'fulfilled' ? (shippersResponse.value.data?.length || 0) : 0
                });

            } catch (err) {
                console.error('An unexpected error occurred during stat fetch:', err);
                setError('Failed to load dashboard data. Please check the network connection.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    };

    const renderContent = () => {
        if (loading) return <div>Loading dashboard...</div>;
        if (error) return <div className="error-message">{error}</div>;

        switch (activeSection) {
            case 'users': return <ManageUsers adminService={adminService} />;
            case 'products': return <ManageProducts adminService={adminService} />;
            case 'stores': return <ManageStores adminService={adminService} />;
            case 'categories': return <ManageCategories adminService={adminService} />;
            case 'brands': return <ManageBrands adminService={adminService} />;
            case 'locations': return <ManageLocations adminService={adminService} />;
            case 'genders': return <ManageGenders adminService={adminService} />;
            case 'orders': return <ManageOrders adminService={adminService} />;
            case 'shippers': return <ManageShippers adminService={adminService} />;
            case 'dashboard':
            default:
                return (
                    <div className="dashboard-grid">
                        <div className="stat-card">
                            <FaUsers size={40} className="icon" />
                            <h3>Total Users</h3>
                            <p>{stats.users}</p>
                        </div>
                        <div className="stat-card">
                            <FaBoxes size={40} className="icon" />
                            <h3>Total Products</h3>
                            <p>{stats.products}</p>
                        </div>
                        <div className="stat-card">
                            <FaStore size={40} className="icon" />
                            <h3>Total Stores</h3>
                            <p>{stats.stores}</p>
                        </div>
                        <div className="stat-card">
                            <FaTags size={40} className="icon" />
                            <h3>Total Categories</h3>
                            <p>{stats.categories}</p>
                        </div>
                        <div className="stat-card">
                            <FaClipboardList size={40} className="icon" />
                            <h3>Total Orders</h3>
                            <p>{stats.orders}</p>
                        </div>
                        <div className="stat-card">
                            <FaTruck size={40} className="icon" />
                            <h3>Total Shippers</h3>
                            <p>{stats.shippers}</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="admin-dashboard">
            <aside className="sidebar">
                <div className="logo">Admin Panel</div>
                <nav>
                    <ul>
                        <li className={activeSection === 'dashboard' ? 'active' : ''} onClick={() => setActiveSection('dashboard')}>
                            <FaBoxes /> Dashboard
                        </li>
                        <li className={activeSection === 'users' ? 'active' : ''} onClick={() => setActiveSection('users')}>
                            <FaUsers /> Users
                        </li>
                        <li className={activeSection === 'products' ? 'active' : ''} onClick={() => setActiveSection('products')}>
                            <FaBoxes /> Products
                        </li>
                        <li className={activeSection === 'stores' ? 'active' : ''} onClick={() => setActiveSection('stores')}>
                            <FaStore /> Stores
                        </li>
                        <li className={activeSection === 'orders' ? 'active' : ''} onClick={() => setActiveSection('orders')}>
                            <FaClipboardList /> Orders
                        </li>
                        <li className={activeSection === 'shippers' ? 'active' : ''} onClick={() => setActiveSection('shippers')}>
                            <FaTruck /> Shippers
                        </li>
                        <li className={activeSection === 'categories' ? 'active' : ''} onClick={() => setActiveSection('categories')}>
                            <FaTags /> Categories & Subcategories
                        </li>
                        <li className={activeSection === 'brands' ? 'active' : ''} onClick={() => setActiveSection('brands')}>
                            <FaTags /> Brands
                        </li>
                        <li className={activeSection === 'locations' ? 'active' : ''} onClick={() => setActiveSection('locations')}>
                            <FaMapMarkedAlt /> Locations (Cities & States)
                        </li>
                        <li className={activeSection === 'genders' ? 'active' : ''} onClick={() => setActiveSection('genders')}>
                            <FaGenderless /> Genders
                        </li>
                    </ul>
                </nav>
                <div className="logout-section">
                    <button onClick={handleLogout} className="logout-btn">
                        <FaSignOutAlt className="logout-icon" /> Logout
                    </button>
                </div>
            </aside>
            <main className="main-content">
                <header className="main-header">
                    <h1>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Management</h1>
                </header>
                <div className="content-area">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
