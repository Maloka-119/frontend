import React, { useState, useEffect } from 'react';
import './BookingsManagement.css';
import AccsetAgen from './AccsetAgen.jpg';
import AgenBackicon from './AgenBackicon.jpg';

export default function BookingsManagementPage() {
  const [bookings, setBookings] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);

  const apiUrl = "https://localhost:7050/api/Booking";
  const storedToken = localStorage.getItem("token"); // تم التعديل هنا - إزالة JSON.parse

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${storedToken}`,
  };

  // جلب الحجوزات من الـ API
  const fetchBookings = async () => {
    try {
      const response = await fetch(apiUrl, { headers });
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();

      // تحويل البيانات الواردة من API إلى التنسيق المطلوب
      const formattedBookings = data.map(booking => ({
        id: booking.id,
        tourName: booking.tripPackage?.title || 'Unknown Tour',
        status: booking.status,
        touristId: booking.touristId,
        touristName: booking.tourist?.name || 'Unknown Tourist',
        bookingDate: new Date(booking.bookingDate).toLocaleDateString()
      }));

      setBookings(formattedBookings.filter(booking => booking.status !== 'Pending'));
      setPendingBookings(formattedBookings.filter(booking => booking.status === 'Pending'));
    } catch (error) {
      console.error("Error fetching bookings:", error);
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
        // تحديث الحالة المحلية بعد الموافقة
        const updatedPending = pendingBookings.filter(booking => booking.id !== id);
        const approvedBooking = pendingBookings.find(booking => booking.id === id);
        
        if (approvedBooking) {
          approvedBooking.status = 'Approved';
          setBookings([...bookings, approvedBooking]);
        }
        
        setPendingBookings(updatedPending);
      } else {
        console.error("Error approving booking");
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
        // تحديث الحالة المحلية بعد الرفض
        const updatedPending = pendingBookings.filter(booking => booking.id !== id);
        const rejectedBooking = pendingBookings.find(booking => booking.id === id);
        
        if (rejectedBooking) {
          rejectedBooking.status = 'Rejected';
          setBookings([...bookings, rejectedBooking]);
        }
        
        setPendingBookings(updatedPending);
      } else {
        console.error("Error rejecting booking");
      }
    } catch (error) {
      console.error("Error rejecting booking:", error);
    }
  };

  return (
    <div className="bookings-management-container" style={{ backgroundImage: `url(${AccsetAgen})` }}>
      <h2>Bookings Management</h2>

      {/* عرض الطلبات قيد الانتظار */}
      <div className="pending-bookings">
        <h3 style={{ color: "#1d4ed8" }}>Pending Bookings:</h3>
        {pendingBookings.length > 0 ? (
          pendingBookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <h4>Booking ID: {booking.id}</h4>
              <p>Tour: {booking.tourName}</p>
              <p>Tourist: {booking.touristName}</p>
              <p>Booking Date: {booking.bookingDate}</p>
              <p>Booking Status: Pending</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                <button
                  onClick={() => handleApproveBooking(booking.id)}
                  style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                    backgroundColor: '#22c55e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRejectBooking(booking.id)}
                  style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
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

      {/* عرض جميع الحجوزات */}
      <div className="all-bookings">
        <h3 style={{ color: "#1d4ed8" }}>All Bookings:</h3>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <h4>Booking ID: {booking.id}</h4>
              <p>Tour: {booking.tourName}</p>
              <p>Tourist: {booking.touristName}</p>
              <p>Booking Date: {booking.bookingDate}</p>
              <p>Booking Status: {booking.status}</p>
            </div>
          ))
        ) : (
          <p>No bookings found</p>
        )}
      </div>
    </div>
  );
}