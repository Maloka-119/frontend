import React, { useEffect, useState } from 'react';
import Appagenbackgr from './Appagenbackgr.jpg';
import BackiconAdmin from './BackiconAdmin.jpg';

const PendingTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = "https://localhost:7050/api/TripPackage"; 

  // الحصول على الرمز المميز بطريقة آمنة
  const getToken = () => {
    try {
      const tokenData = localStorage.getItem("token");
      if (!tokenData) return null;
      
      // إذا كان الرمز المميز مخزن كسلسلة JSON
      if (tokenData.startsWith("{") || tokenData.startsWith("[")) {
        return JSON.parse(tokenData);
      }
      
      // إذا كان الرمز المميز مخزن مباشرة كسلسلة JWT
      return { tokenValue: { token: tokenData } };
    } catch (err) {
      console.error("Error parsing token:", err);
      return null;
    }
  };

  const tokenData = getToken();
  const authToken = tokenData?.tokenValue?.token;

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    if (!authToken) {
      setError('Authentication token is missing or invalid');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      
      if (Array.isArray(data)) {
        setTours(data);
      } else {
        setError('Data format is not correct. Expected an array.');
      }
    } catch (err) {
      setError('Error fetching tours: ' + err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTourAction = async (id, action) => {
    if (!authToken) {
      setError('Authentication token is missing');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}/status?status=${action}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to update tour status. Status: ${response.status}`);
      }

      fetchTours(); // Refresh the list after update
    } catch (err) {
      console.error(`Error updating tour ${id} to ${action}:`, err);
      setError(`Failed to update tour: ${err.message}`);
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
        Array.isArray(tours) && tours.length > 0 ? (
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
                  <td>{tour.travelAgencyName || `Agency ${tour.travelAgencyId}`}</td>
                  <td>{tour.destination}</td>
                  <td>{tour.price}</td>
                  <td>{tour.durationDays}</td>
                  <td>{tour.status || "Pending"}</td>
                  <td>
                    <div className="button-group">
                      <button 
                        className="respond-btn" 
                        onClick={() => handleTourAction(tour.id, 'Approved')}
                        disabled={tour.status === 'Approved'}
                      >
                        Approve
                      </button>
                      <button 
                        className="info-btn" 
                        style={{ background: "red" }} 
                        onClick={() => handleTourAction(tour.id, 'Rejected')}
                        disabled={tour.status === 'Rejected'}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tours available</p>
        )
      )}
    </div>
  );
};

export default PendingTours;