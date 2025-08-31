import React, { useState, useEffect, useContext } from 'react';
import { SellerServiceContext } from '../seller.context';
import StatsCard from '../shared/StatsCard';
import './SellerDashboard.css';

const SellerDashboardPage = () => {
    const sellerService = useContext(SellerServiceContext);
    const sellerId = localStorage.getItem("userId");

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!sellerService || !sellerId) {
            setError("Please log in to view the dashboard.");
            setLoading(false);
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const storesResponse = await sellerService.getUserStores(sellerId);
                const sellerStores = storesResponse.data || [];

                if (sellerStores.length === 0) {
                    setStats({ totalRevenue: 0, productCount: 0, pendingOrderCount: 0 });
                    return;
                }

                const productPromises = sellerStores.map(store => sellerService.getProductsByStore(store.storeId));
                const orderPromises = sellerStores.map(store => sellerService.getOrdersByStore(store.storeId));

                const productResponses = await Promise.all(productPromises);
                const orderResponses = await Promise.all(orderPromises);

                const allProducts = productResponses.flatMap(res => res.data || []);
                const allOrders = orderResponses.flatMap(res => res.data || []);
                
                const productCount = allProducts.length;
                const pendingOrderCount = allOrders.filter(o => o.orderStatus === 'Processing').length;
                const totalRevenue = allOrders.filter(o => o.orderStatus !== 'Cancelled').reduce((sum, order) => sum + order.totalAmount, 0);

                setStats({ totalRevenue, productCount, pendingOrderCount });
            } catch (err) {
                console.error("Failed to build dashboard data:", err);
                setError("Could not load dashboard data. An API might be unavailable.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [sellerService, sellerId]);

    if (loading) return <div className="loading-state">Loading Dashboard...</div>;
    if (error) return <div className="error-state">{error}</div>;

    const displayStats = stats || { totalRevenue: 0, productCount: 0, pendingOrderCount: 0 };

    return (
        <div>
            <div className="page-header"><h2 className="page-title">Dashboard Overview</h2></div>
            <div className="stats-grid">
                <StatsCard title="Total Revenue" value={`$${displayStats.totalRevenue.toLocaleString()}`} icon={"$"} color="#27ae60" />
                <StatsCard title="Listed Products" value={displayStats.productCount} icon={"📦"} color="#2980b9" />
                <StatsCard title="Pending Orders" value={displayStats.pendingOrderCount} icon={"📋"} color="#f39c12" />
            </div>
            <div className="seller-card">
                <h3 className="card-title">Recent Activity</h3>
                <p>This is where a list or chart of recent sales or product updates would go.</p>
            </div>
        </div>
    );
};

export default SellerDashboardPage;