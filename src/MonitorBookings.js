import React, { useEffect, useState } from 'react';
import './MonitorBookings.css';
import Bookingman from './Bookingman.jpg';
import { useNavigate } from 'react-router-dom';

const MonitorBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    date: '',
    status: '',
  });

  useEffect(() => {
    const fetchBookingsWithDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        // جلب بيانات الحجوزات
        const bookingsResponse = await fetch('https://localhost:7050/api/Booking', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!bookingsResponse.ok) {
          if (bookingsResponse.status === 401) {
            throw new Error('Unauthorized access. Please login again.');
          } else if (bookingsResponse.status === 403) {
            throw new Error('You do not have permission to view bookings.');
          } else {
            throw new Error('Failed to fetch bookings.');
          }
        }

        const bookingsData = await bookingsResponse.json();

        // جلب بيانات كل سائح ورحلة بشكل منفصل
        const bookingsWithDetails = await Promise.all(
          bookingsData.map(async (booking) => {
            try {
              const [touristResponse, tripResponse] = await Promise.all([
                fetch(`https://localhost:7050/api/Tourist/${booking.touristId}`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`https://localhost:7050/api/TripPackage/${booking.tourPackageId}`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                }),
              ]);

              const tourist = touristResponse.ok ? await touristResponse.json() : null;
              const tripPackage = tripResponse.ok ? await tripResponse.json() : null;

              return {
                id: booking.id,
                touristName: tourist?.username || `Tourist #${booking.touristId}`,
                tripName: tripPackage?.name || `Trip #${booking.tourPackageId}`,
                date: booking.bookingDate,
                status: booking.status.toLowerCase()
              };
            } catch (err) {
              console.error('Error fetching details for booking', booking.id, err);
              return {
                id: booking.id,
                touristName: `Tourist #${booking.touristId}`,
                tripName: `Trip #${booking.tourPackageId}`,
                date: booking.bookingDate,
                status: booking.status.toLowerCase()
              };
            }
          })
        );

        setBookings(bookingsWithDetails);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('Unauthorized') || err.message.includes('permission')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsWithDetails();
  }, [navigate]);

  const filteredBookings = bookings.filter((booking) => {
    const matchesDate = filters.date
      ? new Date(booking.date).toDateString() === new Date(filters.date).toDateString()
      : true;

    const matchesStatus = filters.status
      ? booking.status === filters.status.toLowerCase()
      : true;

    return matchesDate && matchesStatus;
  });

  return (
    <div className="monitor-bookings-container" style={{ backgroundImage: `url(${Bookingman})` }}>
      <h2 style={{ color: "white" }}>Monitor All Bookings and Transactions</h2>

      <div className="filters">
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="status-message">
          <p>Loading bookings...</p>
        </div>
      ) : error ? (
        <div className="status-message">
          <p className="error-message">{error}</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="status-message">
          <p>No bookings found matching your criteria.</p>
        </div>
      ) : (
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Tourist ID</th>
              <th>Trip ID</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.touristName}</td>
                <td>{booking.tripName}</td>
                <td>{new Date(booking.date).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MonitorBookings;