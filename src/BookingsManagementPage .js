import React, { useState, useEffect } from 'react';
import './BookingsManagement.css';
import AccsetAgen from './AccsetAgen.jpg';
import AgenBackicon from './AgenBackicon.jpg';

export default function BookingsManagementPage() {
  const [bookings, setBookings] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);

  const apiUrl = "https://localhost:7050/api/Booking";
  const storedToken = localStorage.getItem("token");

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${storedToken}`,
  };

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      const response = await fetch(apiUrl, { headers });
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();

      // Format the bookings data according to API response structure
      const formattedBookings = data.map(booking => ({
        id: booking.id,
        tourName: booking.tripPackage?.title || 'Unknown Tour',
        status: booking.status,
        touristId: booking.touristId,
        touristName: booking.tourist?.userName || 'Unknown Tourist', // Changed from name to userName
        bookingDate: formatDate(booking.bookingDate),
        tourPackageId: booking.tourPackageId,
        touristEmail: booking.tourist?.email || 'No email'
      }));

      setBookings(formattedBookings.filter(booking => booking.status !== 'Pending'));
      setPendingBookings(formattedBookings.filter(booking => booking.status === 'Pending'));
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString; // Return original if formatting fails
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleApproveBooking = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/${id}/approve`, {
        method: 'PUT',
        headers: headers,
      });

      if (response.ok) {
        // Update local state after approval
        const updatedPending = pendingBookings.filter(booking => booking.id !== id);
        const approvedBooking = pendingBookings.find(booking => booking.id === id);
        
        if (approvedBooking) {
          approvedBooking.status = 'Approved';
          setBookings([...bookings, approvedBooking]);
        }
        
        setPendingBookings(updatedPending);
      } else {
        console.error("Error approving booking");
        const errorData = await response.json();
        console.error("Error details:", errorData);
      }
    } catch (error) {
      console.error("Error approving booking:", error);
    }
  };

  const handleRejectBooking = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/${id}/reject`, {
        method: 'PUT',
        headers: headers,
      });

      if (response.ok) {
        // Update local state after rejection
        const updatedPending = pendingBookings.filter(booking => booking.id !== id);
        const rejectedBooking = pendingBookings.find(booking => booking.id === id);
        
        if (rejectedBooking) {
          rejectedBooking.status = 'Rejected';
          setBookings([...bookings, rejectedBooking]);
        }
        
        setPendingBookings(updatedPending);
      } else {
        console.error("Error rejecting booking");
        const errorData = await response.json();
        console.error("Error details:", errorData);
      }
    } catch (error) {
      console.error("Error rejecting booking:", error);
    }
  };

  return (
    <div className="bookings-management-container" style={{ backgroundImage: `url(${AccsetAgen})` }}>
      <h2>Bookings Management</h2>

      {/* Pending bookings section */}
      <div className="pending-bookings">
        <h3 style={{ color: "#1d4ed8" }}>Pending Bookings:</h3>
        {pendingBookings.length > 0 ? (
          pendingBookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <h4>Booking ID: {booking.id}</h4>
              <p>Tour: {booking.tourName}</p>
              <p>Tourist: {booking.touristName}</p>
              <p>Tourist Email: {booking.touristEmail}</p>
              <p>Booking Date: {booking.bookingDate}</p>
              <p>Status: <span style={{ color: 'orange' }}>{booking.status}</span></p>
              <div className="booking-actions">
                <button
                  onClick={() => handleApproveBooking(booking.id)}
                  className="approve-btn"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRejectBooking(booking.id)}
                  className="reject-btn"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending bookings</p>
        )}
      </div>

      {/* All bookings section */}
      <div className="all-bookings">
        <h3 style={{ color: "#1d4ed8" }}>All Bookings:</h3>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <h4>Booking ID: {booking.id}</h4>
              <p>Tour: {booking.tourName}</p>
              <p>Tourist: {booking.touristName}</p>
              <p>Booking Date: {booking.bookingDate}</p>
              <p>Status: 
                <span style={{ 
                  color: booking.status === 'Approved' ? 'green' : 
                        booking.status === 'Rejected' ? 'red' : 'orange'
                }}>
                  {booking.status}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p>No bookings found</p>
        )}
      </div>
    </div>
  );
}