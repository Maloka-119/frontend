import logo from './logo.svg';
import './App.css';
import Login from "./Login";
import NewAccount from './NewAccount'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import ManageAgencies from './ManageAgencies';
import ComplaintsManagement from './ComplaintsManagement';
import ManageTripCategories from './ManageTripCategories';
import MonitorBookings from './MonitorBookings';
import Home from './Home';
import TravelAgencyDashboard from './TravelAgencyDashboard.js';
import BookingsManagementPage from './BookingsManagementPage .js';
import TourManagementPage from './TourManagementPage.js';
import React, { useState, useEffect } from 'react';
import TouristHome from './TouristHome.js';
import ResetPassword from './ResetPassword.js';
import AgencyApplications from './AgencyApplications.js';
import Chat from './Chat.js';


function App() {
  return(
   <div>
  
    {
     <Router> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset_password" element={<ResetPassword/>}/>
        <Route path="/new-account" element={<NewAccount />} />
        <Route path="/admin" element={<AdminDashboard />} />
         <Route path="/manage-agencies" element={<ManageAgencies />} />
         <Route path="/support" element={<ComplaintsManagement />} />
         <Route path="/Agency-Applications" element={<AgencyApplications />} />
         <Route path="/manage-categories" element={<ManageTripCategories/>} />
        <Route path="/manage-bookings" element={<MonitorBookings/>} />
        <Route path="/travel-agency" element={<TravelAgencyDashboard />} />
       <Route path="/tour-management" element={<TourManagementPage />} />
       <Route path="/bookings-management" element={<BookingsManagementPage />} />
       <Route path="/chatting" element={<Chat/>} />
       <Route path="/chatting/:touristId" element={<Chat />} />
       <Route path="/tourist" element={<TouristHome />} />

      </Routes>
    </Router>}
    </div>

   
  );
  
}

export default App;

// const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || ''); // تخزين الـ role بعد تسجيل الدخول

//   useEffect(() => {
//     // التأكد من الـ role عند تحميل الـ App
//     const role = localStorage.getItem('userRole');
//     if (role) {
//       setUserRole(role);
//     }
//   }, []);

//   return (
//     <Router>
//       <Routes>
//         {/* الصفحات العامة */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login setUserRole={setUserRole} />} />
//         <Route path="/new-account" element={<NewAccount />} />

//         {/* المسارات الخاصة بـ Admin */}
//         {userRole === 'admin' && (
//           <>
//             <Route path="/admin" element={<AdminDashboard />} />
//             <Route path="/manage-agencies" element={<ManageAgencies />} />
//             <Route path="/support" element={<ComplaintsManagement />} />
//             <Route path="/manage-categories" element={<ManageTripCategories />} />
//             <Route path="/manage-bookings" element={<MonitorBookings />} />
//           </>
//         )}

//         {/* المسارات الخاصة بـ Travel Agency */}
//         {userRole === 'travel-agency' && (
//           <>
//             <Route path="/travel-agency" element={<TravelAgencyDashboard />} />
//             <Route path="/tour-management" element={<TourManagementPage />} />
//             <Route path="/bookings-management" element={<BookingsManagementPage />} />
//           </>
//         )}

//         {/* المسار الخاص بـ Tourist */}
//         {userRole === 'tourist' && (
//           <Route path="/tourist" element={<TouristDashboard />} />
//         )}
//       </Routes>
//     </Router>
//   );


// ---------------------------------
{/* <Router> 
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/new-account" element={<NewAccount />} />
  </Routes>
    </Router> */}

    // <Router> 
    //   <Routes>
    //     <Route path="/" element={<AdminDashboard />} />
    //     <Route path="/manage-agencies" element={<ManageAgencies />} />
    //     <Route path="/support" element={<ComplaintsManagement />} />
    //     <Route path="/manage-categories" element={<ManageTripCategories/>} />
    //     <Route path="/manage-bookings" element={<MonitorBookings/>} />
    //   </Routes>
    // </Router>

  //   <Router>
  //   <Routes>
  //     <Route path="/" element={<TravelAgencyDashboard />} />
  //     <Route path="/tour-management" element={<TourManagementPage />} />
  //     <Route path="/bookings-management" element={<BookingsManagementPage />} />
  //   </Routes>
  //  </Router>

