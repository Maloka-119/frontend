// import React, { useEffect, useState } from 'react';

// import Appagenbackgr from './Appagenbackgr.jpg';
// import BackiconAdmin from './BackiconAdmin.jpg';

// const PendingTours = () => {
//   const [tours, setTours] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const API_URL = "https://your-api-url.com"; // عدل ده حسب السيرفر بتاعك

//   useEffect(() => {
//     fetchTours();
//   }, []);

//   const fetchTours = async () => {
//     try {
//       const response = await fetch(`${API_URL}/tours?status=pending`);
//       const data = await response.json();
//       setTours(data);
//     } catch (err) {
//       setError('Error fetching tours.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTourAction = async (id, action) => {
//     try {
//       await fetch(`${API_URL}/tours/${id}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: action }), // action = "approved" أو "rejected"
//       });

//       fetchTours(); // تحديث القائمة بعد الإجراء
//     } catch (err) {
//       console.error(`Error updating tour ${id} to ${action}`);
//     }
//   };

//   return (
//     <div className="complaints-management-container" style={{ backgroundImage: `url(${Appagenbackgr})` }}>
//       <h2 style={{ color: "white" }}>Pending Tours</h2>

//       {loading ? (
//         <p>Loading tours...</p>
//       ) : error ? (
//         <p className="error-message">{error}</p>
//       ) : (
//         <table className="complaints-table">
//           <thead>
//             <tr>
//               <th>Tour ID</th>
//               <th>Title</th>
//               <th>Agency Name</th>
//               <th>Destination</th> 
//               <th>Price</th>
//               <th>Duration (Days)</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tours.map((tour) => (
//               <tr key={tour.id}>
//                 <td>{tour.id}</td>
//                 <td>{tour.title}</td>
//                 <td>{tour.agencyName}</td>
//                 <td>{tour.Destination}</td> 
//                 <td>{tour.price}</td>
//                 <td>{tour.duration}</td>
//                 <td>{tour.status}</td>
//                 <td>
//                   <div className="button-group">
//                     <button className="respond-btn" onClick={() => handleTourAction(tour.id, 'approved')}>
//                       Approve
//                     </button>
//                     <button className="info-btn" onClick={() => handleTourAction(tour.id, 'rejected')}>
//                       Reject
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       <a href="/admin" className="home-icon-link">
//         <img src={BackiconAdmin} alt="Home" className="home-icon" />
//       </a>
//     </div>
//   );
// };

// export default PendingTours;

import React, { useEffect, useState } from 'react';

import Appagenbackgr from './Appagenbackgr.jpg';
import BackiconAdmin from './BackiconAdmin.jpg';

const PendingTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = "https://jsonplaceholder.typicode.com"; // اللينك الوهمي

  useEffect(() => {
    fetchTours();
  }, []);

  // دالة لتحميل البيانات
  const fetchTours = async () => {
    try {
      const response = await fetch(`${API_URL}/todos`);
      const data = await response.json();
      setTours(data);
    } catch (err) {
      setError('Error fetching tours.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // دالة للتحديث (موافقة أو رفض)
  const handleTourAction = async (id, action) => {
    try {
      await fetch(`${API_URL}/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: action === 'approved' }), // action = "approved" أو "rejected"
      });

      fetchTours(); // تحديث الرحلات بعد التحديث
    } catch (err) {
      console.error(`Error updating tour ${id} to ${action}`);
    }
  };

  return (
    <div className="complaints-management-container" style={{ backgroundImage: `url(${Appagenbackgr})` }}>
      <h2 style={{ color: "white" }}>Manage Tour Applications</h2>

      {loading ? (
        <p>Loading tours...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table className="complaints-table">
          <thead>
            <tr>
              <th>Tour ID</th>
              <th>Title</th>
              <th>Agency Name</th>
              <th>Destination</th>
              <th>Price</th>
              <th>Duration (Days)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour.id}>
                <td>{tour.id}</td>
                <td>{tour.title}</td>
                <td>Agency {tour.userId}</td> {/* بما أن الـ JSONPlaceholder مفيش وكالة معينة */}
                <td>{tour.Destination}</td>
                <td>{tour.id * 10}</td> {/* سعر وهمي */}
                <td>5</td> {/* مدة وهمية */}
                <td>{tour.completed ? "Approved" : "Pending"}</td>
                <td>
                  <div className="button-group">
                    <button className="respond-btn"  onClick={() => handleTourAction(tour.id, 'approved')}>
                      Approve
                    </button>
                    <button className="info-btn" style={{background:"red"}} onClick={() => handleTourAction(tour.id, 'rejected')}>
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <a href="/admin" className="home-icon-link">
        <img src={BackiconAdmin} alt="Home" className="home-icon" />
      </a>
    </div>
  );
};

export default PendingTours;
