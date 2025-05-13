import AgenBackicon from './AgenBackicon.jpg';
import React, { useState, useEffect } from 'react';
import './TourManagement.css';
import TourAgenMan from './TourAgenMan.jpg';

export default function TourManagementPage() {
  const [tours, setTours] = useState([]);
  const [newTour, setNewTour] = useState({
    tripId: 0,
    title: '',
    description: '',
    tripCategoryId: 0,
    destination: '',
    price: 0,
    durationDays: 0,
    startDate: '',
    endDate: '',
    travelAgencyId: 0,
    availableSeats: 0,
    status: 'active',
  });
  const [editTour, setEditTour] = useState(null);

  const apiUrl = "https://localhost:7050/api/TripPackage";

  // استخراج التوكن
  const getToken = () => localStorage.getItem('token');

  // جلب travelAgencyId من الـ API
  const fetchAgencyId = async () => {
    try {
      const token = getToken();
      const response = await fetch("https://localhost:7050/api/Agency/GetByToken", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Failed to fetch agency ID");

      const data = await response.json();
      localStorage.setItem('travelAgencyId', data.agencyId);
      return data.agencyId;
    } catch (error) {
      console.error("Error fetching agency ID:", error);
      alert("Error fetching agency ID. Please login again.");
      return null;
    }
  };

  // استخراج التوكن و travelAgencyId
  const getAuthHeaders = async () => {
    const token = getToken();
    let travelAgencyId = localStorage.getItem('travelAgencyId');

    if (!travelAgencyId) {
      travelAgencyId = await fetchAgencyId();
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'TravelAgencyId': travelAgencyId,
    };
  };

  // Fetch tours from the API
  const fetchTours = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers,
      });
      const data = await response.json();
      console.log("Fetched Data: ", data);
      setTours(data);
    } catch (error) {
      console.error("Error fetching tours:", error);
      alert("Error fetching tours from the server.");
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleAddTour = async (e) => {
    e.preventDefault();
    const travelAgencyId = await fetchAgencyId();
    if (!travelAgencyId) return;

    const tourData = { ...newTour, travelAgencyId: parseInt(travelAgencyId) };

    if (!tourData.title || !tourData.destination || tourData.price <= 0) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const headers = await getAuthHeaders();
      const requestOptions = {
        method: editTour ? 'PUT' : 'POST',
        headers,
        body: JSON.stringify(tourData),
      };

      let response;
      if (editTour) {
        response = await fetch(`${apiUrl}/${editTour.tripId}`, requestOptions);
      } else {
        response = await fetch(apiUrl, requestOptions);
      }

      if (!response.ok) {
        const result = await response.json();
        alert(`Failed to add/update tour: ${result.message || "Unknown error"}`);
        return;
      }

      alert("Tour added/updated successfully!");
      await fetchTours();
      setNewTour({
        tripId: 0,
        title: '',
        description: '',
        tripCategoryId: 0,
        destination: '',
        price: 0,
        durationDays: 0,
        startDate: '',
        endDate: '',
        travelAgencyId: 0,
        availableSeats: 0,
        status: 'active',
      });
      setEditTour(null);

    } catch (error) {
      console.error("Error adding/updating tour:", error);
      alert("Failed to add/update the tour. Please try again.");
    }
  };

  const handleEditTour = (tour) => {
    setEditTour(tour);
    setNewTour({ ...tour });
  };

  const handleDeleteTour = async (tripId) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${apiUrl}/${tripId}`, {
        method: 'DELETE',
        headers,
      });
      if (response.ok) {
        setTours(tours.filter((tour) => tour.tripId !== tripId));
      } else {
        alert("Failed to delete tour.");
      }
    } catch (error) {
      console.error("Error deleting tour:", error);
      alert("Error deleting tour.");
    }
  };

  const toggleTourStatus = async (tripId, currentStatus) => {
    try {
      const headers = await getAuthHeaders();
      const updatedTour = { ...tours.find((tour) => tour.tripId === tripId), status: currentStatus === 'active' ? 'inactive' : 'active' };
      const response = await fetch(`${apiUrl}/${tripId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedTour),
      });

      if (response.ok) {
        const result = await response.json();
        setTours(tours.map((tour) => (tour.tripId === tripId ? result : tour)));
      } else {
        alert("Failed to update tour status.");
      }
    } catch (error) {
      console.error("Error updating tour status:", error);
    }
  };

  return (
    <div className="tour-management-container" style={{ backgroundImage: `url(${TourAgenMan})` }}>
      <h2>Tour Management</h2>
      <form onSubmit={handleAddTour}>
        <h3>{editTour ? 'Edit Tour' : 'Add New Tour'}</h3>
        {['title', 'destination', 'description', 'price', 'tripCategoryId', 'durationDays', 'availableSeats', 'startDate', 'endDate', 'travelAgencyId'].map((field) => (
          <label key={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}:
            <input
              type={['price', 'tripCategoryId', 'durationDays', 'availableSeats', 'travelAgencyId'].includes(field) ? 'number' : field.includes('Date') ? 'date' : 'text'}
              value={newTour[field]}
              onChange={(e) => setNewTour({ ...newTour, [field]: e.target.value })}
            />
          </label>
        ))}
        <button type="submit">{editTour ? 'Update Tour' : 'Add Tour'}</button>
      </form>

      <div className="tour-list">
        {tours.map((tour) => (
          <div key={tour.tripId} className="tour-card">
            <h3>{tour.title ?? "No Title"}</h3>
            <p>Destination: {tour.destination ?? "Not Specified"}</p>
            <p>Price: ${tour.price ?? "N/A"}</p>
            <p>Duration: {tour.durationDays ? `${tour.durationDays} days` : "N/A"}</p>
            <p>Available Seats: {tour.availableSeats ?? "N/A"}</p>
            <p>Status: {tour.status}</p>
            <button onClick={() => handleEditTour(tour)}>Edit</button>
            <button onClick={() => handleDeleteTour(tour.tripId)}>Delete</button>
            <button onClick={() => toggleTourStatus(tour.tripId, tour.status)}>
              {tour.status === 'active' ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
