// the real one

// import React, { useEffect, useState } from 'react';
// import './ComplaintsManagement.css';
// import Supportpic from './Supportpic.jpg'
// import BackiconAdmin from './BackiconAdmin.jpg'

// const ComplaintsManagement = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [response, setResponse] = useState('');
//   const [error, setError] = useState('');
//   const API_URL = "https://your-api-url.com"; // قم بتعديل الرابط هنا ليكون رابط API الحقيقي الخاص بك

//   useEffect(() => {
//     const fetchComplaints = async () => {
//       try {
//         const response = await fetch(`${API_URL}/complaints`); // تعديل الرابط ليتناسب مع API الحقيقى
//         const data = await response.json();
//         setComplaints(data);
//       } catch (err) {
//         setError('Error fetching complaints.');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchComplaints();
//   }, []);

//   // Handle response to a complaint
//   const handleResponse = async (id) => {
//     if (!response) {
//       setError('Please enter a response.');
//       return;
//     }

//     try {
//       const res = await fetch(`${API_URL}/complaints/${id}`, {
//         method: 'PATCH', // استخدام PATCH لتحديث البيانات
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ response }),
//       });

//       if (res.ok) {
//         setComplaints(complaints.map(complaint =>
//           complaint.id === id ? { ...complaint, status: 'Responded' } : complaint
//         ));
//         setResponse('');
//         setError('');
//       } else {
//         setError('Error submitting response.');
//       }
//     } catch (err) {
//       setError('Network error. Please try again.');
//       console.error(err);
//     }
//   };

//   // Handle request for more information
//   const handleRequestInfo = async (id) => {
//     try {
//       const res = await fetch(`${API_URL}/complaints/${id}`, {
//         method: 'PATCH', // استخدام PATCH لتحديث البيانات
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message: 'Please provide more details.' }),
//       });

//       if (res.ok) {
//         setComplaints(complaints.map(complaint =>
//           complaint.id === id ? { ...complaint, status: 'Info Requested' } : complaint
//         ));
//       } else {
//         setError('Error requesting more information.');
//       }
//     } catch (err) {
//       setError('Network error. Please try again.');
//       console.error(err);
//     }
//   };

//   return (
//     <div className="complaints-management-container" style={{ backgroundImage: `url(${Supportpic})` }}>
//       <h2 style={{color:"white"}}>Complaints Management</h2>

//       {loading ? (
//         <p>Loading complaints...</p>
//       ) : error ? (
//         <p className="error-message">{error}</p>
//       ) : (
//         <table className="complaints-table">
//           <thead>
//             <tr>
//               <th>Complaint ID</th>
//               <th>User</th>
//               <th>Complaint Message</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {complaints.map((complaint) => (
//               <tr key={complaint.id}>
//                 <td>{complaint.Touristid}</td>
//                 <td>{complaint.title}</td> 
//                 <td>{complaint.status}</td>
//                 <td>{complaint.status || 'Pending'}</td>
//                 <td>
//                   <div className="button-group">
//                     <button className="respond-btn" onClick={() => handleResponse(complaint.id)}>
//                       Respond
//                     </button>
//                     <button className="info-btn" onClick={() => handleRequestInfo(complaint.id)}>
//                       Request Info
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       <div className="response-section">
//         <textarea
//           value={response}
//           onChange={(e) => setResponse(e.target.value)}
//           placeholder="Enter your response"
//         />
//         <button className="submit-response" onClick={() => handleResponse(complaints.id)}>
//           Submit Response
//         </button>
//       </div>

//       {/* Icon link to home page */}
//       <a href="/admin" className="home-icon-link">
//         <img src={BackiconAdmin} alt="Home" className="home-icon" /> 
//       </a>
//     </div>
//   );
// };

// export default ComplaintsManagement;




// test

import React, { useEffect, useState } from 'react';
import './ComplaintsManagement.css';
import Supportpic from './Supportpic.jpg'
import BackiconAdmin from './BackiconAdmin.jpg'

const ComplaintsManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        // استخدام API وهمي لجلب الشكاوى من JSONPlaceholder
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        setComplaints(data);
      } catch (err) {
        setError('Error fetching complaints.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // Handle response to a complaint
  const handleResponse = async (id) => {
    if (!response) {
      setError('Please enter a response.');
      return;
    }

    try {
      // إرسال الاستجابة إلى API وهمي باستخدام PATCH
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'PATCH', // استخدام PATCH لتحديث البيانات
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response }),
      });

      if (res.ok) {
        setComplaints(complaints.map(complaint =>
          complaint.id === id ? { ...complaint, status: 'Responded' } : complaint
        ));
        setResponse('');
        setError('');
      } else {
        setError('Error submitting response.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    }
  };

  // Handle request for more information
  const handleRequestInfo = async (id) => {
    try {
      // طلب مزيد من المعلومات باستخدام API وهمي
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'PATCH', // استخدام PATCH لتحديث البيانات
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Please provide more details.' }),
      });

      if (res.ok) {
        setComplaints(complaints.map(complaint =>
          complaint.id === id ? { ...complaint, status: 'Info Requested' } : complaint
        ));
      } else {
        setError('Error requesting more information.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="complaints-management-container" style={{ backgroundImage: `url(${Supportpic})` }}>
      <h2 style={{color:"white"}}>Complaints Management</h2>

      {loading ? (
        <p>Loading complaints...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table className="complaints-table">
          <thead>
            <tr>
              <th>Complaint ID</th>
              <th>User</th>
              <th>Complaint Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id}>
                <td>{complaint.id}</td>
                <td>{complaint.userId}</td> {/* استبدال بـ userId أو أي حقل آخر متاح */}
                <td>{complaint.title}</td> {/* استبدال بـ title أو أي حقل آخر متاح */}
                <td>{complaint.status || 'Pending'}</td>
                <td>
                <div className="button-group">
  <button className="respond-btn" onClick={() => handleResponse(complaint.id)}>
    Respond
  </button>
  <button className="info-btn" onClick={() => handleRequestInfo(complaint.id)}>
    Request Info
  </button>
</div>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="response-section">
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Enter your response"
        />
        <button className="submit-response" onClick={() => handleResponse(complaints.id)}>
          Submit Response
        </button>
      </div>
      {/* Icon link to home page */}
  <a href="/admin" className="home-icon-link">
    <img src={BackiconAdmin} alt="Home" className="home-icon" /> 
  </a>
    </div>
  );
};

export default ComplaintsManagement;
