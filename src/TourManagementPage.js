import AgenBackicon from './AgenBackicon.jpg';
import React, { useState, useEffect } from 'react';
import './TourManagement.css';
import TourAgenMan from './TourAgenMan.jpg';

export default function TourManagementPage() {
  const [tours, setTours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTour, setNewTour] = useState({
    tripId: 0,
    title: '',
    description: '',
    tripCategoryId: '',
    destination: '',
    price: 1,
    durationDays: 1,
    startDate: '',
    endDate: '',
    travelAgencyId: 1,
    availableSeats: 1,
    status: 'Approved',
  });
  const [editTour, setEditTour] = useState(null);

  const apiUrl = "https://localhost:7050/api/TripPackage";
  const categoriesApiUrl = "https://localhost:7050/api/TripCategory";

  // Get token from localStorage
  const getToken = () => localStorage.getItem('token');

  // Fetch travel agency ID using token
const fetchAgencyId = async () => {
    try {
      const token = getToken();
      
      // إذا كان الـ token يحتوي على الـ agencyId يمكنك استخراجه مباشرة
      const payload = JSON.parse(atob(token.split('.')[1])); // فك تشفير جزء الـ payload من الـ JWT
      const agencyId = payload.agencyId || payload.userId; // حسب ما هو مخزن في الـ token

      if (!agencyId) throw new Error("Agency ID not found in token");

      localStorage.setItem('travelAgencyId', agencyId);
      return agencyId;
    } catch (error) {
      console.error("Error getting agency ID from token:", error);
      alert("Error getting agency ID. Please login again.");
      return null;
    }
  };
  // Get authentication headers
  const getAuthHeaders = async () => {
    const token = getToken();
    let travelAgencyId = localStorage.getItem('travelAgencyId');

    if (!travelAgencyId) {
      travelAgencyId = await fetchAgencyId();
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  // Fetch all trip categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(categoriesApiUrl);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Error fetching trip categories.");
    }
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
    fetchCategories();
    fetchTours();
  }, []);

  const handleAddTour = async (e) => {
    e.preventDefault();
    const travelAgencyId = await fetchAgencyId();
    if (!travelAgencyId) return;

    // Format dates to ISO string
    const formattedTour = {
      ...newTour,
      travelAgencyId: parseInt(travelAgencyId),
      tripCategoryId: parseInt(newTour.tripCategoryId),
      startDate: newTour.startDate ? new Date(newTour.startDate).toISOString() : '',
      endDate: newTour.endDate ? new Date(newTour.endDate).toISOString() : '',
    };

    if (!formattedTour.title || !formattedTour.destination || formattedTour.price <= 0 || !formattedTour.tripCategoryId) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const headers = await getAuthHeaders();
      const requestOptions = {
        method: editTour ? 'PUT' : 'POST',
        headers,
        body: JSON.stringify(formattedTour),
      };

      let url = editTour ? `${apiUrl}/${editTour.tripId}` : apiUrl;
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const result = await response.json();
        alert(`Failed to ${editTour ? 'update' : 'add'} tour: ${result.message || "Unknown error"}`);
        return;
      }

      alert(`Tour ${editTour ? 'updated' : 'added'} successfully!`);
      await fetchTours();
      resetForm();
    } catch (error) {
      console.error(`Error ${editTour ? 'updating' : 'adding'} tour:`, error);
      alert(`Failed to ${editTour ? 'update' : 'add'} the tour. Please try again.`);
    }
  };

  const resetForm = () => {
    setNewTour({
      tripId: 0,
      title: '',
      description: '',
      tripCategoryId: '',
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
  };

  const handleEditTour = (tour) => {
    // Convert dates to format compatible with date inputs (YYYY-MM-DD)
    const formattedTour = {
      ...tour,
      startDate: tour.startDate ? tour.startDate.split('T')[0] : '',
      endDate: tour.endDate ? tour.endDate.split('T')[0] : '',
    };
    setEditTour(formattedTour);
    setNewTour(formattedTour);
  };

  const handleDeleteTour = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this tour?")) return;
    
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${apiUrl}/${tripId}`, {
        method: 'DELETE',
        headers,
      });
      
      if (response.ok) {
        alert("Tour deleted successfully!");
        await fetchTours();
      } else {
        throw new Error("Failed to delete tour");
      }
    } catch (error) {
      console.error("Error deleting tour:", error);
      alert("Error deleting tour. Please try again.");
    }
  };

  const toggleTourStatus = async (tripId, currentStatus) => {
    try {
      const headers = await getAuthHeaders();
      const tourToUpdate = tours.find(tour => tour.tripId === tripId);
      const updatedTour = { 
        ...tourToUpdate, 
        status: currentStatus === 'active' ? 'inactive' : 'active' 
      };

      const response = await fetch(`${apiUrl}/${tripId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedTour),
      });

      if (response.ok) {
        alert(`Tour status updated to ${updatedTour.status}`);
        await fetchTours();
      } else {
        throw new Error("Failed to update tour status");
      }
    } catch (error) {
      console.error("Error updating tour status:", error);
      alert("Error updating tour status. Please try again.");
    }
  };

  return (
    <div className="tour-management-container" style={{ backgroundImage: `url(${TourAgenMan})` }}>
      <h2>Tour Management</h2>
      
      <form onSubmit={handleAddTour}>
        <h3>{editTour ? 'Edit Tour' : 'Add New Tour'}</h3>
        
        <label>
          Title:
          <input
            type="text"
            value={newTour.title}
            onChange={(e) => setNewTour({ ...newTour, title: e.target.value })}
            required
          />
        </label>
        
        <label>
          Description:
          <input
          type="text"
            value={newTour.description}
            onChange={(e) => setNewTour({ ...newTour, description: e.target.value })}
          />
        </label>
        
        <label>
          Category:
          <select
            value={newTour.tripCategoryId}
            onChange={(e) => setNewTour({ ...newTour, tripCategoryId: e.target.value })}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        
        <label>
          Destination:
          <input
            type="text"
            value={newTour.destination}
            onChange={(e) => setNewTour({ ...newTour, destination: e.target.value })}
            required
          />
        </label>
        
        <label>
          Price:
          <input
            type="number"
            min="0"
            value={newTour.price}
            onChange={(e) => setNewTour({ ...newTour, price: parseFloat(e.target.value) })}
            required
          />
        </label>
        
        <label>
          Duration (days):
          <input
            type="number"
            min="1"
            value={newTour.durationDays}
            onChange={(e) => setNewTour({ ...newTour, durationDays: parseInt(e.target.value) })}
            required
          />
        </label>
        
        <label>
          Available Seats:
          <input
            type="number"
            min="0"
            value={newTour.availableSeats}
            onChange={(e) => setNewTour({ ...newTour, availableSeats: parseInt(e.target.value) })}
            required
          />
        </label>
        
        <label>
          Start Date:
          <input
            type="date"
            value={newTour.startDate}
            onChange={(e) => setNewTour({ ...newTour, startDate: e.target.value })}
          />
        </label>
        
        <label>
          End Date:
          <input
            type="date"
            value={newTour.endDate}
            onChange={(e) => setNewTour({ ...newTour, endDate: e.target.value })}
          />
        </label>
        
        <div className="form-actions">
          <button type="submit">{editTour ? 'Update Tour' : 'Add Tour'}</button>
          {editTour && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="tour-list">
        {tours.length > 0 ? (
          tours.map((tour) => (
            <div key={tour.tripId} className="tour-card"> 
              
              <h3>{tour.title}</h3>
              <p>Destination: {tour.destination}</p>
              <p>Category: {categories.find(c => c.id === tour.tripCategoryId)?.name || 'Unknown'}</p>
              <p>Price: ${tour.price}</p>
              <p>Duration: {tour.durationDays} days</p>
              <p>Available Seats: {tour.availableSeats}</p>
              <p>Status: <span className={`status-${tour.status}`}>{tour.status}</span></p>
              
              <div className="tour-actions" style={{ display: 'flex', gap: '10px' ,justifyContent: 'center' }}>
                <button className="edit-button" onClick={() => handleEditTour(tour)}>Edit</button>
                <button className="delete-button" onClick={() => handleDeleteTour(tour.tripId)}>Delete</button>
                {/* <button 
                  onClick={() => toggleTourStatus(tour.tripId, tour.status)}
                  className={tour.status === 'active' ? 'btn-deactivate' : 'btn-activate'}
                >
                  {tour.status === 'active' ? "Deactivate" : "Activate"}
                </button> */}
              </div>
            </div>
          ))
        ) : (
          <p>No tours available. Add your first tour!</p>
        )}
      </div>
    </div>
  );
}


