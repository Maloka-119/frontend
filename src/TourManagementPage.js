// the real one

// import AgenBackicon from './AgenBackicon.jpg';
// import React, { useState, useEffect } from 'react';
// import './TourManagement.css';
// import TourAgenMan from './TourAgenMan.jpg';

// export default function TourManagementPage() {
//   const [tours, setTours] = useState([]);
//   const [newTour, setNewTour] = useState({
//     destination: '',
//     price: '',
//     itinerary: '',
//     duration: '',
//     availableSeats: '',
//     active: true,
//   });
//   const [editTour, setEditTour] = useState(null);

//   const apiUrl = "https://your-api-endpoint.com/tours"; // استبدل بـ URL الـ API الحقيقي

//   // جلب البيانات من الـ API الحقيقي
//   const fetchTours = async () => {
//     try {
//       const response = await fetch(apiUrl);
//       const data = await response.json();
//       setTours(data);
//     } catch (error) {
//       console.error("Error fetching tours:", error);
//     }
//   };

//   useEffect(() => {
//     fetchTours();
//   }, []);

//   const handleAddTour = async (e) => {
//     e.preventDefault();

//     const requestOptions = {
//       method: editTour ? 'PUT' : 'POST', // PUT لتعديل و POST لإضافة
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(newTour),
//     };

//     try {
//       let response;
//       if (editTour) {
//         response = await fetch(`${apiUrl}/${editTour.id}`, requestOptions);
//       } else {
//         response = await fetch(apiUrl, requestOptions);
//       }
      
//       const result = await response.json();
//       if (editTour) {
//         const updatedTours = tours.map((tour) =>
//           tour.id === editTour.id ? { ...tour, ...newTour } : tour
//         );
//         setTours(updatedTours);
//         setEditTour(null);
//       } else {
//         setTours([...tours, result]);
//       }

//       setNewTour({
//         destination: '',
//         price: '',
//         itinerary: '',
//         duration: '',
//         availableSeats: '',
//         active: true,
//       });

//     } catch (error) {
//       console.error("Error adding/updating tour:", error);
//     }
//   };

//   const handleEditTour = (tour) => {
//     setEditTour(tour);
//     setNewTour({
//       destination: tour.destination,
//       price: tour.price,
//       itinerary: tour.itinerary,
//       duration: tour.duration,
//       availableSeats: tour.availableSeats,
//       active: tour.active,
//     });
//   };

//   const handleDeleteTour = async (id) => {
//     try {
//       const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
//       if (response.ok) {
//         setTours(tours.filter((tour) => tour.id !== id));
//       }
//     } catch (error) {
//       console.error("Error deleting tour:", error);
//     }
//   };

//   const toggleTourStatus = async (id, currentStatus) => {
//     try {
//       const updatedTour = { ...tours.find(tour => tour.id === id), active: !currentStatus };
//       const response = await fetch(`${apiUrl}/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedTour),
//       });
//       const result = await response.json();

//       setTours(tours.map((tour) =>
//         tour.id === id ? result : tour
//       ));
//     } catch (error) {
//       console.error("Error updating tour status:", error);
//     }
//   };

//   return (
//     <div className="tour-management-container" style={{ backgroundImage: `url(${TourAgenMan})` }}>
//       <h2>Tour Management</h2>

//       {/* إضافة أو تعديل رحلة جديدة */}
//       <form onSubmit={handleAddTour}>
//         <h3>{editTour ? 'Edit Tour' : 'Add New Tour'}</h3>
//         <label>
//           Destination:
//           <input
//             type="text"
//             value={newTour.destination}
//             onChange={(e) => setNewTour({ ...newTour, destination: e.target.value })}
//           />
//         </label>
//         <label>
//           Price:
//           <input
//             type="number"
//             value={newTour.price}
//             onChange={(e) => setNewTour({ ...newTour, price: e.target.value })}
//           />
//         </label>
//         <label>
//           Itinerary:
//           <input
//             type="text"
//             value={newTour.itinerary}
//             onChange={(e) => setNewTour({ ...newTour, itinerary: e.target.value })}
//           />
//         </label>
//         <label>
//           Duration:
//           <input
//             type="text"
//             value={newTour.duration}
//             onChange={(e) => setNewTour({ ...newTour, duration: e.target.value })}
//           />
//         </label>
//         <label>
//           Available Seats:
//           <input
//             type="number"
//             value={newTour.availableSeats}
//             onChange={(e) => setNewTour({ ...newTour, availableSeats: e.target.value })}
//           />
//         </label>
//         <button type="submit">{editTour ? 'Update Tour' : 'Add Tour'}</button>
//       </form>

//       {/* عرض الرحلات */}
//       <div className="tour-list">
//         {tours.map((tour) => (
//           <div key={tour.id} className="tour-card">
//             {/* زر التبديل لتحديد الحالة */}
//             <label className="flex items-center cursor-pointer">
//               <div className="relative">
//                 <input
//                   type="checkbox"
//                   className="sr-only"
//                   checked={tour.active}
//                   onChange={() => toggleTourStatus(tour.id, tour.active)}
//                 />
//                 <div className="block">
//                   <span className="status-text">
//                     {tour.active ? "On" : "Off"}
//                   </span>
//                 </div>
//                 <div
//                   className={`dot ${tour.active ? "translate-x-full bg-green-500" : ""}`}
//                 ></div>
//               </div>
//             </label>

//             <h3>{tour.title}</h3>
//             <p>Destination: {tour.destination}</p>
//             <p>Price: ${tour.price}</p>
//             <p>Duration: {tour.duration} days</p>
//             <p>Available Seats: {tour.availableSeats}</p>
//             <p>Status: {tour.active ? "Available" : "Unavailable"}</p>

//             <button className="edit-button" onClick={() => handleEditTour(tour)}>Edit</button>
//             <button className="delete-button" onClick={() => handleDeleteTour(tour.id)}>Delete</button>
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



//test

import AgenBackicon from './AgenBackicon.jpg';
import React, { useState, useEffect } from 'react';
import './TourManagement.css';
import TourAgenMan from './TourAgenMan.jpg';

export default function TourManagementPage() {
  const [tours, setTours] = useState([]);
  const [newTour, setNewTour] = useState({
    destination: '',
    price: '',
    itinerary: '',
    duration: '',
    availableSeats: '',
    active: true, // إضافة حالة الرحلة
  });
  const [editTour, setEditTour] = useState(null);

  // API وهمي للتجربة
  const apiUrl = "https://jsonplaceholder.typicode.com/posts";

  // جلب البيانات من الـ API الوهمي
  const fetchTours = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setTours(data.map((item) => ({
        id: item.id,
        title: item.title,
        destination: "Sample Destination",
        price: 100,
        availableSeats: 25,
        active: true, // إضافة الحالة هنا
      })));
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleAddTour = (e) => {
    e.preventDefault();
    if (editTour) {
      const updatedTours = tours.map((tour) =>
        tour.id === editTour.id ? { ...tour, ...newTour } : tour
      );
      setTours(updatedTours);
      setEditTour(null);
    } else {
      const newTourWithId = { ...newTour, id: tours.length + 1 };
      setTours([...tours, newTourWithId]);
    }
    setNewTour({
      destination: '',
      price: '',
      itinerary: '',
      duration: '',
      availableSeats: '',
      active: true, // إعادة تعيين الحالة
    });
  };

  const handleEditTour = (tour) => {
    setEditTour(tour);
    setNewTour({
      destination: tour.destination,
      price: tour.price,
      itinerary: tour.itinerary,
      duration: tour.duration,
      availableSeats: tour.availableSeats,
      active: tour.active, // الحفاظ على الحالة
    });
  };

  const handleDeleteTour = (id) => {
    const updatedTours = tours.filter((tour) => tour.id !== id);
    setTours(updatedTours);
  };

  const toggleTourStatus = (id, currentStatus) => {
    const updatedTours = tours.map((tour) =>
      tour.id === id ? { ...tour, active: !currentStatus } : tour
    );
    setTours(updatedTours);
  };

  return (
    <div className="tour-management-container" style={{ backgroundImage: `url(${TourAgenMan})` }}>
      <h2>Tour Management</h2>

      {/* إضافة أو تعديل رحلة جديدة */}
      <form className='formtm' onSubmit={handleAddTour}>
        <h3>{editTour ? 'Edit Tour' : 'Add New Tour'}</h3>
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
          Itinerary:
          <input
            type="text"
            value={newTour.itinerary}
            onChange={(e) => setNewTour({ ...newTour, itinerary: e.target.value })}
          />
        </label>
        <label>
          Duration:
          <input
            type="text"
            value={newTour.duration}
            onChange={(e) => setNewTour({ ...newTour, duration: e.target.value })}
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
        <button type="submit">{editTour ? 'Update Tour' : 'Add Tour'}</button>
      </form>

      {/* عرض الرحلات */}
      <div className="tour-list">
        {tours.map((tour) => (
          <div key={tour.id} className="tour-card">
            {/* زر التبديل لتحديد الحالة */}
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={tour.active}
                  onChange={() => toggleTourStatus(tour.id, tour.active)}
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
            <p>Duration: {tour.duration} days</p>
            <p>Available Seats: {tour.availableSeats}</p>
            <p>Status: {tour.active ? "Available" : "Unavailable"}</p>

            <button className="edit-button" onClick={() => handleEditTour(tour)}>Edit</button>
            <button className="delete-button" onClick={() => handleDeleteTour(tour.id)}>Delete</button>
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



