import React, { useEffect, useState } from 'react';
import './ComplaintsManagement.css';
import Supportpic from './Supportpic.jpg';
import BackiconAdmin from './BackiconAdmin.jpg';

const ComplaintsManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
          const storedToken = JSON.parse(localStorage.getItem("token"));
        const res = await fetch('https://localhost:7050/api/AdminDashboard/complaints', {
          headers: {
            'Authorization': `Bearer ${storedToken.tokenValue.token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch complaints.');
        }

        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        setError(err.message || 'Error fetching complaints.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleResponse = async (id) => {
    const response = responses[id];
    if (!response) {
      setError('Please enter a response for this complaint.');
      return;
    }

    try {
       const storedToken = JSON.parse(localStorage.getItem("token"));
      const res = await fetch(`https://localhost:7050/api/Complaint/${id}/respond`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${storedToken.tokenValue.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response }),
      });

      if (res.ok) {
        setComplaints(complaints.map(c =>
          c.id === id ? { ...c, status: 'Responded' } : c
        ));
        setResponses((prev) => ({ ...prev, [id]: '' }));
        setError('');
      } else {
        setError('Error submitting response.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    }
  };

  const handleRequestInfo = async (id) => {
    try {
       const storedToken = JSON.parse(localStorage.getItem("token"));
      const res = await fetch(`https://localhost:7050/api/Complaint/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${storedToken.tokenValue.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Please provide more details.' }),
      });

      if (res.ok) {
        setComplaints(complaints.map(c =>
          c.id === id ? { ...c, status: 'Info Requested' } : c
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
      <h2 style={{ color: "white" }}>Complaints Management</h2>

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
                <td>{complaint.userId || 'Unknown User'}</td>
                <td>{complaint.title || 'No Title Provided'}</td>
                <td>{complaint.status || 'Pending'}</td>
                <td>
                  <div className="button-group">
                    <textarea
                      value={responses[complaint.id] || ''}
                      onChange={(e) =>
                        setResponses((prev) => ({ ...prev, [complaint.id]: e.target.value }))
                      }
                      placeholder="Enter your response"
                    />
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
    </div>
  );
};

export default ComplaintsManagement;
