// test 

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import './AdminDashboard.css';
// import Adminman from './Adminman.jpg';

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     agencies: 0,
//     tours: 0,
//     bookings: 0,
//     users: 0,
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://localhost:7050/api/AdminDashboard/summary");
//         const data = await response.json();
//         setStats(data);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <div className="admin-dashboard-container" style={{ backgroundImage: `url(${Adminman})` }}>
      
//       {/* Title */}
//       <h2 className="admin-dashboard-title" style={{color:"white"}}>Admin Dashboard</h2>

//       {/* Navbar */}
//       <div className="admin-navbar">
//         <div className="admin-nav-links">
//           <Link to="/manage-agencies">Manage Agencies</Link>
//           <Link to="/manage-categories">Manage Categories</Link>
//           <Link to="/manage-bookings">Manage Bookings</Link>
//           <Link to="/support">Complaints & Support</Link>
//           <Link to="/Agency-Applications">Manage Tours</Link>
//         </div>
//         <div>
//           <Link to="/login" className="logoutadmin">LOGOUT</Link>
//         </div>
//       </div>

//       {/* Stats Section */}
//       <div className="dashboard-stats">
//         <div className="stat-item"><h3>{stats.agencies}</h3><p>Agencies</p></div>
//         <div className="stat-item"><h3>{stats.tours}</h3><p>Tours</p></div>
//         <div className="stat-item"><h3>{stats.bookings}</h3><p>Bookings</p></div>
//         <div className="stat-item"><h3>{stats.users}</h3><p>Users</p></div>
//       </div>

//     </div>
//   );
// };

// export default AdminDashboard;

//-----------------------------------------------
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
        
        const storedToken = JSON.parse(localStorage.getItem("token"));
        
        if (!storedToken.tokenValue.token) {
          navigate('/login');
          return;
        }

        // استخدم HTTP بدلاً من HTTPS للتطوير المحلي
        const response = await fetch("https://localhost:7050/api/AdminDashboard/summary", {
          headers: {
            "Authorization": `Bearer ${storedToken.tokenValue.token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.clear();
            navigate('/login');
            return;
          }
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log("API Data:", data);
        
        // تأكد من تطابق أسماء الخصائص مع ما يرجعه الخادم
        setStats({
          agencies: data.agencies || data.totalAgencies || 0,
          tours: data.tours || data.totalTours || 0,
          bookings: data.bookings || data.totalBookings || 0,
          users: data.users || data.totalUsers || 0
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message.includes('Failed to fetch')
          ? "Cannot connect to server. Please check your connection."
          : "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
   localStorage.removeItem("token");
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="admin-dashboard-container loading">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container" style={{ backgroundImage: `url(${Adminman})` }}>
      <h2 className="admin-dashboard-title" style={{color:"white"}}>Admin Dashboard</h2>

      {error && (
        <div className="admin-error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      <div className="admin-navbar">
        <div className="admin-nav-links">
          <Link to="/manage-agencies">Manage Agencies</Link>
          <Link to="/manage-categories">Manage Categories</Link>
          <Link to="/manage-bookings">Manage Bookings</Link>
          <Link to="/support">Complaints & Support</Link>
          <Link to="/Agency-Applications">Manage Tours</Link>
        </div>
        <div>
          <button onClick={handleLogout} className="logoutadmin">LOGOUT</button>
        </div>
      </div>

      {!isLoading && (
        <div className="dashboard-stats">
          <div className="stat-item"><h3>{stats.agencies}</h3><p>Agencies</p></div>
          <div className="stat-item"><h3>{stats.tours}</h3><p>Tours</p></div>
          <div className="stat-item"><h3>{stats.bookings}</h3><p>Bookings</p></div>
          <div className="stat-item"><h3>{stats.users}</h3><p>Users</p></div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;