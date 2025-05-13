// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import './TravelAgencyDashboard.css';
// import AgenDashboard from './AgenDashboard.jpg'

// export default function TravelAgencyDashboard() {
//   const [totalTours, setTotalTours] = useState(0);
//   const [pendingBookings, setPendingBookings] = useState(0);
//   const [messages, setMessages] = useState(0);
//   const [newBookings, setNewBookings] = useState(0); 
//   const [availableTours, setAvailableTours] = useState(0);

//   const apiUrl = "https://api.example.com/agency-dashboard"; 

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(apiUrl);
//         const data = await response.json();

//         setTotalTours(data.totalTours);
//         setPendingBookings(data.pendingBookings);
//         setMessages(data.messages);
//         setNewBookings(data.newBookings);
//         setAvailableTours(data.availableTours);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="dashboard-container" style={{ backgroundImage: `url(${AgenDashboard})` }}>
//       <div className="navbar">
//         <div className="navbar-title">Agency Dashboard</div>
//         <div className="navbar-links">
//           <Link to="/tour-management" className="navbar-link">Tour Management</Link>
//           <Link to="/bookings-management" className="navbar-link">Bookings Management</Link>
//           <Link to="/chatting" className="navbar-link">Chat with Tourists</Link>
//           <Link to="/login" className="navbar-link">LOGOUT</Link>
//         </div>
//       </div>

//       <div className="dashboard-grid">
//         <div className="dashboard-card">
//           <h2>Total Tours</h2>
//           <p>{totalTours}</p>
//         </div>

//         <div className="dashboard-card">
//           <h2>Pending Bookings</h2>
//           <p>{pendingBookings}</p>
//         </div>

//         <div className="dashboard-card">
//           <h2>New Bookings</h2>
//           <p>{newBookings}</p>
//         </div>

//         <div className="dashboard-card">
//           <h2>Messages</h2>
//           <p>{messages}</p>
//         </div>

//         <div className="dashboard-card">
//           <h2>Available Tours</h2>
//           <p>{availableTours}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

//new 
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // استيراد useNavigate
import './TravelAgencyDashboard.css';
import AgenDashboard from './AgenDashboard.jpg';

export default function TravelAgencyDashboard() {
  const [totalTours, setTotalTours] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [messages, setMessages] = useState(0);
  const [newBookings, setNewBookings] = useState(0); 
  const [availableTours, setAvailableTours] = useState(0);

  const navigate = useNavigate(); // استخدام useNavigate للتوجيه
  
  // افتراضاً سيتم أخذ الـ agencyId من الـ localStorage أو من الـ props أو من الـ URL 
  const agencyId = localStorage.getItem("agencyId") || 1; // يمكنك تغيير هذه القيمة حسب المكان الذي تحفظ فيه agencyId

  const apiUrl = `https://localhost:7050/api/Agency/summary/${agencyId}`; // API URL مع agencyId

  // دالة لجلب البيانات من API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}` // إضافة التوكن إذا كان المستخدم مسجل دخول
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        
        setTotalTours(data.totalTours);
        setPendingBookings(data.pendingBookings);
        setMessages(data.messages);
        setNewBookings(data.newBookings);
        setAvailableTours(data.availableTours);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [agencyId]); // تتغير إذا تغير agencyId

  // دالة لتسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("token"); // مسح التوكن
    
    navigate(-1); // التوجه إلى الصفحة الرئيسية
  };

  return (
    <div className="dashboard-container" style={{ backgroundImage: `url(${AgenDashboard})` }}>
      <div className="navbar">
        <div className="navbar-title">Agency Dashboard</div>
        <div className="navbar-links">
          <Link to="/tour-management" className="navbar-link">Tour Management</Link>
          <Link to="/bookings-management" className="navbar-link">Bookings Management</Link>
          <Link to="/chatting" className="navbar-link">Chat with Tourists</Link>
          <button onClick={handleLogout} className="navbar-link">LOGOUT</button> {/* تعديل هنا على زر الخروج */}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Total Tours</h2>
          <p>{totalTours}</p>
        </div>

        <div className="dashboard-card">
          <h2>Pending Bookings</h2>
          <p>{pendingBookings}</p>
        </div>

        <div className="dashboard-card">
          <h2>New Bookings</h2>
          <p>{newBookings}</p>
        </div>

        <div className="dashboard-card">
          <h2>Messages</h2>
          <p>{messages}</p>
        </div>

        <div className="dashboard-card">
          <h2>Available Tours</h2>
          <p>{availableTours}</p>
        </div>
      </div>
    </div>
  );
}

