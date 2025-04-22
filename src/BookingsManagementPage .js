// import React, { useState, useEffect } from 'react';
// import './BookingsManagement.css';
// import AccsetAgen from './AccsetAgen.jpg';
// import AgenBackicon from './AgenBackicon.jpg';

// export default function BookingsManagementPage() {
//   const [bookings, setBookings] = useState([]);
//   const [pendingBookings, setPendingBookings] = useState([]);

//   const apiUrl = "https://your-api-endpoint.com/bookings"; // استبدال بـ URL الـ API الحقيقي

//   // جلب البيانات من الـ API الحقيقي
//   const fetchBookings = async () => {
//     try {
//       const response = await fetch(apiUrl);
//       const data = await response.json();
//       setBookings(data.filter(booking => booking.status !== 'Pending'));
//       setPendingBookings(data.filter(booking => booking.status === 'Pending'));
//     } catch (error) {
//       console.error("Error fetching bookings:", error);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const handleApproveBooking = async (id) => {
//     try {
//       const response = await fetch(`${apiUrl}/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: 'Approved' }), // تحديث الحالة لـ "موافق"
//       });

//       if (response.ok) {
//         const updatedBookings = bookings.map((booking) =>
//           booking.id === id ? { ...booking, status: 'Approved' } : booking
//         );
//         setBookings(updatedBookings);
//         setPendingBookings(pendingBookings.filter(booking => booking.id !== id));
//       }
//     } catch (error) {
//       console.error("Error approving booking:", error);
//     }
//   };

//   const handleRejectBooking = async (id) => {
//     try {
//       const response = await fetch(`${apiUrl}/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: 'Rejected' }), // تحديث الحالة لـ "مرفوض"
//       });

//       if (response.ok) {
//         const updatedBookings = bookings.map((booking) =>
//           booking.id === id ? { ...booking, status: 'Rejected' } : booking
//         );
//         setBookings(updatedBookings);
//         setPendingBookings(pendingBookings.filter(booking => booking.id !== id));
//       }
//     } catch (error) {
//       console.error("Error rejecting booking:", error);
//     }
//   };

//   return (
//     <div className="bookings-management-container" style={{ backgroundImage: `url(${AccsetAgen})` }}>
//       <h2>Bookings Management</h2>

//       {/* عرض الطلبات قيد الانتظار */}
//       <div className="pending-bookings">
//         <h3 style={{ color: "#1d4ed8" }}>Pending Bookings:</h3>
//         {pendingBookings.map((booking) => (
//           <div key={booking.id} className="booking-card">
//             <h4>Booking ID: {booking.id}</h4>
//             <p>Tour: {booking.TourPackageid}</p>
//             <p>Booking Status: Pending</p>
//             <p>Tourist ID: {booking.touristId}</p> {/* عرض touristId */}
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
//               <button
//                 onClick={() => handleApproveBooking(booking.id)}
//                 style={{
//                   padding: '4px 12px',
//                   fontSize: '12px',
//                   backgroundColor: '#22c55e',
//                   color: '#fff',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 Approve
//               </button>
//               <button
//                 onClick={() => handleRejectBooking(booking.id)}
//                 style={{
//                   padding: '4px 12px',
//                   fontSize: '12px',
//                   backgroundColor: '#ef4444',
//                   color: '#fff',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 Reject
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* عرض جميع الحجوزات */}
//       <div className="all-bookings">
//         <h3 style={{ color: "#1d4ed8" }}>All Bookings:</h3>
//         {bookings.map((booking) => (
//           <div key={booking.id} className="booking-card">
//             <h4>Booking ID: {booking.id}</h4>
//             <p>Tour: {booking.TourPackageid}</p>
//             <p>Booking Status: {booking.status}</p>
//             <p>Tourist ID: {booking.touristId}</p> {/* عرض touristId */}
//           </div>
//         ))}
//       </div>

//       {/* Icon link to home page */}
//       <a href="/travel-agency" className="home-icon-link">
//         <img src={AgenBackicon} alt="Home" className="home-icon" />
//       </a>
//     </div>
//   );
// }


// test

import React, { useState, useEffect } from 'react';
import './BookingsManagement.css';
import AccsetAgen from './AccsetAgen.jpg'
import AgenBackicon from './AgenBackicon.jpg';

export default function BookingsManagementPage() {
  const [bookings, setBookings] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);

  const apiUrl = "https://jsonplaceholder.typicode.com/posts";

  const fetchBookings = async () => {
    try {
      const response = await fetch(apiUrl);
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

  const handleApproveBooking = (id) => {
    setPendingBookings(pendingBookings.filter(booking => booking.id !== id));
    const updatedBookings = bookings.map((booking) =>
      booking.id === id ? { ...booking, status: 'Approved' } : booking
    );
    setBookings(updatedBookings);
    console.log("Booking approved:", id);
  };

  const handleRejectBooking = (id) => {
    setPendingBookings(pendingBookings.filter(booking => booking.id !== id));
    const updatedBookings = bookings.map((booking) =>
      booking.id === id ? { ...booking, status: 'Rejected' } : booking
    );
    setBookings(updatedBookings);
    console.log("Booking rejected:", id);
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

      {/* Icon link to home page */}
      <a href="/travel-agency" className="home-icon-link">
        <img src={AgenBackicon} alt="Home" className="home-icon" />
      </a>
    </div>
  );
}

