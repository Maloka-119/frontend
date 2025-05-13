import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from './api';
import './App.css';
import Login from "./Login";
import NewAccount from './NewAccount';
import AdminDashboard from './AdminDashboard';
import ManageAgencies from './ManageAgencies';
import ComplaintsManagement from './ComplaintsManagement';
import ManageTripCategories from './ManageTripCategories';
import MonitorBookings from './MonitorBookings';
import Home from './Home';
import TravelAgencyDashboard from './TravelAgencyDashboard';
import BookingsManagementPage from './BookingsManagementPage ';
import TourManagementPage from './TourManagementPage';
import TouristHome from './TouristHome';
import ResetPassword from './ResetPassword';
import AgencyApplications from './AgencyApplications';
import Chat from './Chat';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/Unauthorized';
import LoadingSpinner from './components/LoadingSpinner';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    userRole: null,
    isLoading: true
  });

  // التحقق من حالة المصادقة عند تحميل التطبيق
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setAuth({ isAuthenticated: false, userRole: null, isLoading: false });
          return;
        }

        // التحقق من صحة التوكن مع الباكند
        const response = await api.get('/auth/validate-token');
        setAuth({
          isAuthenticated: true,
          userRole: response.data.role,
          isLoading: false
        });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setAuth({ isAuthenticated: false, userRole: null, isLoading: false });
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setAuth({
      isAuthenticated: true,
      userRole: userData.role,
      isLoading: false
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setAuth({
      isAuthenticated: false,
      userRole: null,
      isLoading: false
    });
  };

  if (auth.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Routes>
        {/* Routes accessible to all */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-account" element={<NewAccount />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute
              isAllowed={auth.isAuthenticated && auth.userRole === 'Admin'}
              redirectPath="/unauthorized"
            >
              <AdminDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-agencies"
          element={
            <ProtectedRoute
              isAllowed={auth.isAuthenticated && auth.userRole === 'Admin'}
              redirectPath="/unauthorized"
            >
              <ManageAgencies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute
              isAllowed={auth.isAuthenticated && auth.userRole === 'Admin'}
              redirectPath="/unauthorized"
            >
              <ComplaintsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Agency-Applications"
          element={
            <ProtectedRoute
              isAllowed={auth.isAuthenticated && auth.userRole === 'Admin'}
              redirectPath="/unauthorized"
            >
              <AgencyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-categories"
          element={
            <ProtectedRoute
              isAllowed={auth.isAuthenticated && auth.userRole === 'Admin'}
              redirectPath="/unauthorized"
            >
              <ManageTripCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-bookings"
          element={
            <ProtectedRoute
              isAllowed={auth.isAuthenticated && auth.userRole === 'Admin'}
              redirectPath="/unauthorized"
            >
              <MonitorBookings />
            </ProtectedRoute>
          }
        />

        {/* Travel Agency Routes */}
        <Route
          path="/travel-agency"
          element={
            <ProtectedRoute
              isAllowed={auth.isAuthenticated && auth.userRole === 'TravelAgency'}
              redirectPath="/unauthorized"
            >
              <TravelAgencyDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tour-management"
          element={
            <ProtectedRoute
              isAllowed={auth.isAuthenticated && auth.userRole === 'TravelAgency'}
              redirectPath="/unauthorized"
            >
              <TourManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings-management"
          element={
            <ProtectedRoute
              isAllowed={auth.isAuthenticated && auth.userRole === 'TravelAgency'}
              redirectPath="/unauthorized"
            >
              <BookingsManagementPage />
            </ProtectedRoute>
          }
        />
         <Route
          path="/chatting"
          element={
            <ProtectedRoute
              isAllowed={auth.isAuthenticated && auth.userRole === 'TravelAgency'}
              redirectPath="/unauthorized"
            >
              <Chat/>
            </ProtectedRoute>
          }
        />

        {/* Tourist Routes */}
        <Route
          path="/tourist"
          element={
            <ProtectedRoute
              isAllowed={auth.isAuthenticated && auth.userRole === 'Tourist'}
              redirectPath="/unauthorized"
            >
              <TouristHome onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatting"
          element={
            <ProtectedRoute
              isAllowed={auth.isAuthenticated && auth.userRole === 'Tourist'}
              redirectPath="/unauthorized"
            >
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatting/:touristId"
          element={
            <ProtectedRoute
              isAllowed={auth.isAuthenticated && auth.userRole === 'Tourist'}
              redirectPath="/unauthorized"
            >
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;



