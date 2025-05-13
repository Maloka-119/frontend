import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './AdminDashboard.css';
import Adminman from './Adminman.jpg';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    agencies: 0,
    tours: 0,
    bookings: 0,
    users: 0,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");

        // استرجاع التوكن بطريقة آمنة
        const rawToken = localStorage.getItem("token");
        let authToken = null;

        if (rawToken) {
          try {
            // محاولة تحليل التوكن إذا كان مخزناً كـ JSON
            const tokenData = JSON.parse(rawToken);
            authToken = tokenData?.tokenValue?.token || tokenData?.token || rawToken;
          } catch (e) {
            // إذا فشل التحليل، نستخدم التوكن مباشرة كسلسلة نصية
            authToken = rawToken;
          }
        }

        if (!authToken) {
          localStorage.removeItem("token");
          navigate('/login');
          return;
        }

        const response = await fetch("https://localhost:7050/api/AdminDashboard/summary", {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate('/login');
            return;
          }
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        setStats({
          agencies: data.agencies ?? data.totalAgencies ?? 0,
          tours: data.tours ?? data.totalTours ?? 0,
          bookings: data.bookings ?? data.totalBookings ?? 0,
          users: data.users ?? data.totalUsers ?? 0
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err.message.includes('Failed to fetch')
            ? "Cannot connect to server. Please check your connection."
            : err.message || "Failed to load dashboard data"
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // مسح التوكن
    navigate(-1); // التوجه إلى الصفحة الرئيسية
  };

  const handleRetry = () => {
    setError("");
    setIsLoading(true);
    setTimeout(() => window.location.reload(), 300);
  };

  if (isLoading) {
    return (
      <div className="admin-dashboard-container loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container" style={{ backgroundImage: `url(${Adminman})` }}>
      <h2 className="admin-dashboard-title" style={{color:"white"}}>Admin Dashboard</h2>

      {error && (
        <div className="admin-error-message">
          <p>{error}</p>
          <button onClick={handleRetry} className="retry-button">
            Retry
          </button>
        </div>
      )}

      <div className="admin-navbar">
        <div className="admin-nav-links">
          <Link to="/manage-agencies">Manage Agencies</Link>
          <Link to="/manage-categories">Manage Categories</Link>
          <Link to="/manage-bookings">Manage Bookings</Link>
          <Link to="/support">Complaints & Support</Link>
          <Link to="/Agency-Applications">Manage Tour Applications</Link>
        </div>
        <div>
          <button onClick={handleLogout} className="logoutadmin">
            LOGOUT
          </button>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-item">
          <h3>{stats.agencies}</h3>
          <p>Agencies</p>
        </div>
        <div className="stat-item">
          <h3>{stats.tours}</h3>
          <p>Tours</p>
        </div>
        <div className="stat-item">
          <h3>{stats.bookings}</h3>
          <p>Bookings</p>
        </div>
        <div className="stat-item">
          <h3>{stats.users}</h3>
          <p>Users</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;