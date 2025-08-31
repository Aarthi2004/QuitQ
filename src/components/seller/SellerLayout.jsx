import React from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faBoxOpen,
  faClipboardList,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import './dashboard/SellerDashboard.css';

const SellerLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert('Logging out seller...');
    navigate('/login');
  };

  return (
    <div className="seller-app-container">
      <aside className="seller-sidebar">
        <h1 className="sidebar-brand">QuitQ Seller</h1>
        <nav className="sidebar-nav">
          <NavLink to="/seller-dashboard" end className="sidebar-link">
            <FontAwesomeIcon icon={faTachometerAlt} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/seller-dashboard/products" className="sidebar-link">
            <FontAwesomeIcon icon={faBoxOpen} />
            <span>Products</span>
          </NavLink>
          <NavLink to="/seller-dashboard/orders" className="sidebar-link">
            <FontAwesomeIcon icon={faClipboardList} />
            <span>Orders</span>
          </NavLink>
        </nav>
        <button className="sidebar-logout" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Logout</span>
        </button>
      </aside>
      <main className="seller-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerLayout;