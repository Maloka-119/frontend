// the real one

// import React, { useEffect, useState } from 'react';
// import './MonitorBookings.css';
// import Bookingman from './Bookingman.jpg';
// import BackiconAdmin from './BackiconAdmin.jpg';

// const MonitorBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [filters, setFilters] = useState({
//     startDate: '',
//     endDate: '',
//     status: '',
//   });

//   const apiUrl = 'YOUR_BACKEND_API_URL'; // استبدل بهذا الرابط الصحيح للـ API

//   // جلب البيانات عند تحميل الصفحة
//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const response = await fetch(`${apiUrl}/bookings`); // API حقيقي
//         const data = await response.json();
//         setBookings(data);
//       } catch (err) {
//         setError('Failed to fetch bookings.');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBookings();
//   }, []);

//   // التعامل مع العمليات (الموافقة أو الإلغاء)
//   const handleAction = async (id, action) => {
//     try {
//       const url = `${apiUrl}/bookings/${id}`;
//       const method = action === 'cancel' ? 'DELETE' : 'PUT';
//       const response = await fetch(url, {
//         method: method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: action }), // إرسال حالة الحجز
//       });

//       if (response.ok) {
//         setBookings(bookings.filter((booking) => booking.id !== id)); // تحديث القائمة
//       } else {
//         setError('Failed to update booking.');
//       }
//     } catch (err) {
//       setError('Network error. Please try again.');
//       console.error(err);
//     }
//   };

//   // تصفية البيانات بناءً على الفلاتر
//   const filteredBookings = bookings.filter((booking) => {
//     const matchesStartDate = filters.startDate
//       ? new Date(booking.date) >= new Date(filters.startDate)
//       : true;
//     const matchesEndDate = filters.endDate
//       ? new Date(booking.date) <= new Date(filters.endDate)
//       : true;
//     const matchesStatus = filters.status ? booking.status === filters.status : true;

//     return matchesStartDate && matchesEndDate && matchesStatus;
//   });

//   return (
//     <div className="monitor-bookings-container" style={{ backgroundImage: `url(${Bookingman})` }}>
//       <h2 style={{ color: "white" }}>Monitor All Bookings and Transactions</h2>

//       {/* فلاتر البيانات */}
//       <div className="filters">
//         <input
//           type="date"
//           value={filters.startDate}
//           onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
//         />
//         <input
//           type="date"
//           value={filters.endDate}
//           onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
//         />
//         <select
//           value={filters.status}
//           onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//         >
//           <option value="">All Statuses</option>
//           <option value="pending">Pending</option>
//           <option value="approved">Approved</option>
//           <option value="cancelled">Cancelled</option>
//         </select>
//       </div>

//       {/* عرض بيانات الحجوزات */}
//       {loading ? (
//         <p>Loading bookings...</p>
//       ) : error ? (
//         <p className="error-message">{error}</p>
//       ) : (
//         <table className="bookings-table">
//           <thead>
//             <tr>
//               <th>Booking ID</th>
//               <th>Tourist Name</th>
//               <th>Trip</th>
//               <th>Date</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredBookings.map((booking) => (
//               <tr key={booking.id}>
//                 <td>{booking.id}</td>
//                 <td>{booking.touristName}</td>
//                 <td>{booking.tripName}</td>
//                 <td>{new Date(booking.date).toLocaleDateString()}</td>
//                 <td>{booking.status}</td>
//                 <td>
//                   <button onClick={() => handleAction(booking.id, 'approve')}>
//                     Approve
//                   </button>
//                   <button onClick={() => handleAction(booking.id, 'cancel')}>
//                     Cancel
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}


//     </div>
//   );
// };

// export default MonitorBookings;


// -------------------------
// test

import React, { useEffect, useState } from 'react';
import './MonitorBookings.css';
import Bookingman from './Bookingman.jpg';
import BackiconAdmin from './BackiconAdmin.jpg';
import { useNavigate } from 'react-router-dom';

const MonitorBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
         const storedToken = JSON.parse(localStorage.getItem("token"));
        const response = await fetch('https://localhost:7050/api/Booking', {
          headers: {
            'Authorization': `Bearer ${storedToken.tokenValue.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized: Please log in first.');
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const mockBookings = data.slice(0, 10).map((post, index) => ({
          id: index + 1,
          touristName: `Tourist ${index + 1}`,
          tripName: `Trip ${index + 1}`,
          date: '2025-04-08',
          status: index % 2 === 0 ? 'approved' : 'pending',
        }));

        setBookings(mockBookings);
      } catch (err) {
        setError(err.message || 'Failed to fetch bookings.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleAction = async (id, action) => {
    try {
     const storedToken = JSON.parse(localStorage.getItem("token"));
      const url = `http://localhost:7050/api/Booking/${id}`;
      const method = action === 'cancel' ? 'DELETE' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${storedToken.tokenValue.token}`,
          'Content-Type': 'application/json',
        },
        body: method === 'PUT' ? JSON.stringify({ status: action }) : null,
      });

      if (!response.ok) {
        throw new Error('Failed to update booking.');
      }

      // تحديث الواجهة بعد نجاح العملية
      setBookings(bookings.filter((booking) => booking.id !== id));
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
      console.error(err);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesStartDate = filters.startDate
      ? new Date(booking.date) >= new Date(filters.startDate)
      : true;
    const matchesEndDate = filters.endDate
      ? new Date(booking.date) <= new Date(filters.endDate)
      : true;
    const matchesStatus = filters.status ? booking.status === filters.status : true;

    return matchesStartDate && matchesEndDate && matchesStatus;
  });

  return (
    <div className="monitor-bookings-container" style={{ backgroundImage: `url(${Bookingman})` }}>
      <h2 style={{ color: "white" }}>Monitor All Bookings and Transactions</h2>

      {/* فلاتر البيانات */}
      <div className="filters">
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* عرض بيانات الحجوزات */}
      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Tourist Name</th>
              <th>Trip</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.touristName}</td>
                <td>{booking.tripName}</td>
                <td>{new Date(booking.date).toLocaleDateString()}</td>
                <td>{booking.status}</td>
                <td>
                  <button onClick={() => handleAction(booking.id, 'approve')}>Approve</button>
                  <button onClick={() => handleAction(booking.id, 'cancel')}>Cancel</button>
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
