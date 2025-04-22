// the reall one
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

//   const apiUrl = "YOUR_BACKEND_API_URL/stats";  // ضع هنا رابط الـ API الفعلي

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await fetch(apiUrl);
//       const data = await response.json();
//       setStats(data);
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



// test 

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './AdminDashboard.css';
import Adminman from './Adminman.jpg';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    agencies: 0,
    tours: 0,
    bookings: 0,
    users: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("YOUR_BACKEND_API_URL/stats");
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="admin-dashboard-container" style={{ backgroundImage: `url(${Adminman})` }}>
      
      {/* Title */}
      <h2 className="admin-dashboard-title" style={{color:"white"}}>Admin Dashboard</h2>

      {/* Navbar */}
      <div className="admin-navbar">
        <div className="admin-nav-links">
          <Link to="/manage-agencies">Manage Agencies</Link>
          <Link to="/manage-categories">Manage Categories</Link>
          <Link to="/manage-bookings">Manage Bookings</Link>
          <Link to="/support">Complaints & Support</Link>
          <Link to="/Agency-Applications">Manage Tours</Link>
        </div>
        <div>
          <Link to="/login" className="logoutadmin">LOGOUT</Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="dashboard-stats">
        <div className="stat-item"><h3>{stats.agencies}</h3><p>Agencies</p></div>
        <div className="stat-item"><h3>{stats.tours}</h3><p>Tours</p></div>
        <div className="stat-item"><h3>{stats.bookings}</h3><p>Bookings</p></div>
        <div className="stat-item"><h3>{stats.users}</h3><p>Users</p></div>
      </div>

    </div>
  );
};

export default AdminDashboard;

