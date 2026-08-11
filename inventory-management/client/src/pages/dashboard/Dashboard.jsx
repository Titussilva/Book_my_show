import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiTag, FiTruck, FiAlertTriangle, FiActivity } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getDashboardStats } from '../../services/inventoryService';
import Spinner from '../../components/common/Spinner';
import CategoryChart from '../../components/charts/CategoryChart';
import StockChart from '../../components/charts/StockChart';
import LowStockChart from '../../components/charts/LowStockChart';
import Badge from '../../components/common/Badge';
import { formatCurrency, getStockStatus } from '../../utils/helpers';

/**
 * Dashboard page — Admin only
 * Shows stats, charts, and low stock alerts
 */
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data.data);
      } catch (err) {
        toast.error('Failed to load dashboard statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Spinner message="Loading dashboard..." />;

  if (!stats) return (
    <div className="text-center" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
      <p>Unable to load dashboard data. Please ensure the server is running.</p>
    </div>
  );

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts ?? 0,
      icon: <FiPackage />,
      color: 'indigo',
      link: '/products'
    },
    {
      title: 'Categories',
      value: stats.totalCategories ?? 0,
      icon: <FiTag />,
      color: 'blue',
      link: '/categories'
    },
    {
      title: 'Suppliers',
      value: stats.totalSuppliers ?? 0,
      icon: <FiTruck />,
      color: 'green',
      link: '/suppliers'
    },
    {
      title: 'Low Stock',
      value: stats.lowStockProducts ?? 0,
      icon: <FiAlertTriangle />,
      color: 'yellow',
      link: '/products?status=low'
    },
    {
      title: "Today's Transactions",
      value: stats.todayTransactions ?? 0,
      icon: <FiActivity />,
      color: 'purple',
      link: '/inventory/transactions'
    },
  ];

  // Format chart data from aggregation results
  const categoryChartData = stats.productsByCategory
    ? {
        labels: stats.productsByCategory.map((c) => c._id || 'Uncategorized'),
        values: stats.productsByCategory.map((c) => c.count),
      }
    : { labels: [], values: [] };

  const stockChartData = {
    labels: stats.monthlyStockIn?.map((m) => m.month) ||
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    stockIn: stats.monthlyStockIn?.map((m) => m.total) || [],
    stockOut: stats.monthlyStockOut?.map((m) => m.total) || [],
  };

  const lowStockChartData = stats.lowStockItems
    ? {
        labels: stats.lowStockItems.map((p) => p.productName),
        values: stats.lowStockItems.map((p) => p.quantity),
      }
    : { labels: [], values: [] };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Monitor your inventory at a glance</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        {statCards.map((card, idx) => (
          <Link to={card.link} key={idx} style={{ textDecoration: 'none' }}>
            <div className="stat-card">
              <div className={`stat-icon ${card.color}`}>
                {card.icon}
              </div>
              <div>
                <p className="stat-label">{card.title}</p>
                <p className="stat-value">{card.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="charts-grid" style={{ marginBottom: '1.25rem' }}>
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Monthly Stock Flow</h3>
          <div className="chart-container">
            <StockChart data={stockChartData} />
          </div>
        </div>
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Products by Category</h3>
          <div className="chart-container">
            <CategoryChart data={categoryChartData} />
          </div>
        </div>
      </div>

      {/* Charts Row 2 + Low Stock Table */}
      <div className="two-col-grid">
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Low Stock Alert</h3>
          <div className="chart-container">
            <LowStockChart data={lowStockChartData} />
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Low Stock Items</h3>
            <Link to="/products?status=low" className="text-accent text-sm">View all →</Link>
          </div>
          {stats.lowStockItems && stats.lowStockItems.length > 0 ? (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.lowStockItems.map((item) => {
                    const status = getStockStatus(item.quantity);
                    return (
                      <tr key={item._id}>
                        <td style={{ fontWeight: 500 }}>{item.productName}</td>
                        <td className="text-muted text-sm">{item.SKU}</td>
                        <td>
                          <Badge variant={status.color}>{item.quantity}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted text-sm" style={{ textAlign: 'center', padding: '1.5rem' }}>
              ✅ All products are well stocked!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
