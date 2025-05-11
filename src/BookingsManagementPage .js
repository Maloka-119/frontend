import React, { useState, useEffect } from 'react';
import './BookingsManagement.css';
import AccsetAgen from './AccsetAgen.jpg';
import AgenBackicon from './AgenBackicon.jpg';

export default function BookingsManagementPage() {
  const [bookings, setBookings] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);

  const apiUrl = "https://localhost:7050/api/Booking"; // URL الـ API الذي سيتم التفاعل معه
  const storedToken = JSON.parse(localStorage.getItem("token")); // الحصول على التوكن من الـ localStorage

  // إعداد الـ headers التي تحتوي على التوكن
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${storedToken.tokenValue.token}`, // إضافة التوكن في الـ header
  };

  // جلب الحجوزات من الـ API
  const fetchBookings = async () => {
    try {
      const response = await fetch(apiUrl, { headers }); // إرسال الـ headers مع الطلب
      const data = await response.json();

      // بيانات وهمية للتجربة فقط
      const fakeData = data.slice(0, 5).map((item, index) => ({
        id: item.id,
        tourName: item.title,
        status: index % 2 === 0 ? 'Pending' : 'Approved',
        touristId: index + 1 // إضافة touristId وهمي
      }));

      setBookings(fakeData.filter(booking => booking.status !== 'Pending'));
      setPendingBookings(fakeData.filter(booking => booking.status === 'Pending'));
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleApproveBooking = async (id) => {
    try {
      // تحديث حالة الحجز عبر الـ API
      const response = await fetch(`${apiUrl}/${id}/approve`, {
        method: 'PUT',
        headers: headers, // إرسال الـ headers مع الطلب
      });

      if (response.ok) {
        setPendingBookings(pendingBookings.filter(booking => booking.id !== id));
        const updatedBookings = bookings.map((booking) =>
          booking.id === id ? { ...booking, status: 'Approved' } : booking
        );
        setBookings(updatedBookings);
      } else {
        console.error("Error approving booking");
      }
      console.log("Booking approved:", id);
    } catch (error) {
      console.error("Error approving booking:", error);
    }
  };

  const handleRejectBooking = async (id) => {
    try {
      // تحديث حالة الحجز عبر الـ API
      const response = await fetch(`${apiUrl}/${id}/reject`, {
        method: 'PUT',
        headers: headers, // إرسال الـ headers مع الطلب
      });

      if (response.ok) {
        setPendingBookings(pendingBookings.filter(booking => booking.id !== id));
        const updatedBookings = bookings.map((booking) =>
          booking.id === id ? { ...booking, status: 'Rejected' } : booking
        );
        setBookings(updatedBookings);
      } else {
        console.error("Error rejecting booking");
      }
      console.log("Booking rejected:", id);
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
        {pendingBookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <h4>Booking ID: {booking.id}</h4>
            <p>Tour: {booking.tourName}</p>
            <p>Booking Status: Pending</p>
            <p>Tourist ID: {booking.touristId}</p> {/* عرض touristId */}
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
        ))}
      </div>

      {/* عرض جميع الحجوزات */}
      <div className="all-bookings">
        <h3 style={{ color: "#1d4ed8" }}>All Bookings:</h3>
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <h4>Booking ID: {booking.id}</h4>
            <p>Tour: {booking.tourName}</p>
            <p>Booking Status: {booking.status}</p>
            <p>Tourist ID: {booking.touristId}</p> {/* عرض touristId */}
          </div>
        ))}
      </div>
    </div>
  );
}
