import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './TravelAgencyDashboard.css';
import AgenDashboard from './AgenDashboard.jpg'

export default function TravelAgencyDashboard() {
  const [totalTours, setTotalTours] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [messages, setMessages] = useState(0);
  const [newBookings, setNewBookings] = useState(0); 
  const [availableTours, setAvailableTours] = useState(0);

  const apiUrl = "https://api.example.com/agency-dashboard"; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
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
  }, []);

  return (
    <div className="dashboard-container" style={{ backgroundImage: `url(${AgenDashboard})` }}>
      <div className="navbar">
        <div className="navbar-title">Agency Dashboard</div>
        <div className="navbar-links">
          <Link to="/tour-management" className="navbar-link">Tour Management</Link>
          <Link to="/bookings-management" className="navbar-link">Bookings Management</Link>
          <Link to="/chatting" className="navbar-link">Chat with Tourists</Link>
          <Link to="/login" className="navbar-link">LOGOUT</Link>
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

