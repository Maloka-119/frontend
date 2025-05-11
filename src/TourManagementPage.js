import React, { useState, useEffect } from 'react';
import './TourManagement.css';
import TourAgenMan from './TourAgenMan.jpg';

export default function TourManagementPage() {
  const [tours, setTours] = useState([]);
  const [newTour, setNewTour] = useState({
    title: '',
    description: '',
    tripCategory: '',
    destination: '',
    price: '',
    durationDays: '',
    startDate: '',
    endDate: '',
    availableSeats: '',
    active: true, // إضافة حالة افتراضية للرحلة
  });
  const [editTour, setEditTour] = useState(null);

  const apiUrl = "https://localhost:7050/api/TripPackage"; 
  const storedToken = JSON.parse(localStorage.getItem("token")); 

  // إعداد الـ headers التي تحتوي على التوكن
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${storedToken.tokenValue.token}`, // إضافة التوكن في الـ header
  };

  // جلب البيانات من الـ API
  const fetchTours = async () => {
    try {
      const response = await fetch(apiUrl, { headers }); // إضافة الـ headers هنا
      const data = await response.json();
      setTours(data);
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleAddTour = async (e) => {
    e.preventDefault();

    if (!newTour.title || !newTour.description || !newTour.destination || !newTour.price || !newTour.durationDays || !newTour.startDate || !newTour.endDate) {
      alert("All fields are required!");
      return;
    }

    const requestOptions = {
      method: editTour ? 'PUT' : 'POST', // PUT لتعديل و POST لإضافة
      headers: headers, // إضافة الـ headers هنا
      body: JSON.stringify(newTour),
    };

    try {
      let response;
      if (editTour) {
        response = await fetch(`${apiUrl}/${editTour.tripId}`, requestOptions);
      } else {
        response = await fetch(apiUrl, requestOptions);
      }

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Error details:', errorDetails);
        throw new Error(`HTTP Error! status: ${response.status}`);
      }

      const result = await response.json();

      if (editTour) {
        // تحديث الرحلات بعد التعديل
        const updatedTours = tours.map((tour) =>
          tour.tripId === editTour.tripId ? { ...tour, ...newTour } : tour
        );
        setTours(updatedTours);
        setEditTour(null);
      } else {
        // إضافة الرحلة الجديدة مباشرة إلى القائمة
        setTours((prevTours) => [...prevTours, result]);
      }

      // إعادة تعيين البيانات المدخلة
      setNewTour({
        title: '',
        description: '',
        tripCategory: '',
        destination: '',
        price: '',
        durationDays: '',
        startDate: '',
        endDate: '',
        availableSeats: '',
        active: true,
      });

    } catch (error) {
      console.error("Error adding/updating tour:", error);
      alert("An error occurred while adding/updating the tour. Please try again.");
    }
  };

  const handleEditTour = (tour) => {
    setEditTour(tour);
    setNewTour({
      title: tour.title,
      description: tour.description,
      tripCategory: tour.tripCategory,
      destination: tour.destination,
      price: tour.price,
      durationDays: tour.durationDays,
      startDate: tour.startDate,
      endDate: tour.endDate,
      availableSeats: tour.availableSeats,
      active: tour.active, // تأكد من إدراج الحالة النشطة
    });
  };

  const handleDeleteTour = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
        headers: headers, // إضافة الـ headers هنا
      });
      if (response.ok) {
        setTours(tours.filter((tour) => tour.tripId !== id));
      }
    } catch (error) {
      console.error("Error deleting tour:", error);
    }
  };

  const toggleTourStatus = async (id, currentStatus) => {
    try {
      const updatedTour = { ...tours.find(tour => tour.tripId === id), active: !currentStatus };
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: headers, // إضافة الـ headers هنا
        body: JSON.stringify(updatedTour),
      });
      const result = await response.json();

      setTours(tours.map((tour) =>
        tour.tripId === id ? result : tour
      ));
    } catch (error) {
      console.error("Error updating tour status:", error);
    }
  };

  return (
    <div className="tour-management-container" style={{ backgroundImage: `url(${TourAgenMan})` }}>
      <h2>Tour Management</h2>

      {/* إضافة أو تعديل رحلة جديدة */}
      <form onSubmit={handleAddTour}>
        <h3>{editTour ? 'Edit Tour' : 'Add New Tour'}</h3>
        <label>
          Title:
          <input
            type="text"
            value={newTour.title}
            onChange={(e) => setNewTour({ ...newTour, title: e.target.value })}
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
          Destination:
          <input
            type="text"
            value={newTour.destination}
            onChange={(e) => setNewTour({ ...newTour, destination: e.target.value })}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            value={newTour.price}
            onChange={(e) => setNewTour({ ...newTour, price: e.target.value })}
          />
        </label>
        <label>
          Duration (days):
          <input
            type="number"
            value={newTour.durationDays}
            onChange={(e) => setNewTour({ ...newTour, durationDays: e.target.value })}
          />
        </label>
        <label>
          Available Seats:
          <input
            type="number"
            value={newTour.availableSeats}
            onChange={(e) => setNewTour({ ...newTour, availableSeats: e.target.value })}
          />
        </label>
        <label>
          Trip Category:
          <input
            type="text"
            value={newTour.tripCategory}
            onChange={(e) => setNewTour({ ...newTour, tripCategory: e.target.value })}
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
        <button type="submit">{editTour ? 'Update Tour' : 'Add Tour'}</button>
      </form>

      {/* عرض الرحلات */}
      <div className="tour-list">
        {tours.map((tour) => (
          <div key={tour.tripId} className="tour-card">
            {/* زر التبديل لتحديد الحالة */}
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={tour.active}
                  onChange={() => toggleTourStatus(tour.tripId, tour.active)}
                />
                <div className="block">
                  <span className="status-text">
                    {tour.active ? "On" : "Off"}
                  </span>
                </div>
                <div
                  className={`dot ${tour.active ? "translate-x-full bg-green-500" : ""}`}
                ></div>
              </div>
            </label>

            <h3>{tour.title}</h3>
            <p>Destination: {tour.destination}</p>
            <p>Price: ${tour.price}</p>
            <p>Duration: {tour.durationDays} days</p>
            <p>Available Seats: {tour.availableSeats}</p>
            <p>Category: {tour.tripCategory}</p>
            <p>Status: {tour.active ? "Available" : "Unavailable"}</p>

            <button className="edit-button" onClick={() => handleEditTour(tour)}>Edit</button>
            <button className="delete-button" onClick={() => handleDeleteTour(tour.tripId)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
