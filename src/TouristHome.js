import React, { useState } from "react";
import BookingList from "./BookingList";
import Touristhome from "./Touristhome.jpg";
import "./TouristHome.css";
import Bookingform from "./Bookingform";
import { Link } from "react-router-dom";


const TouristHome = () => {
  const [trips, setTrips] = useState([
    {
      Name: "Nile Cruise Adventure",
      Destination: "Luxor & Aswan",
      Price: "7500 EGP",
      category: "Cruise",
      AvailableSeats: 15,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK96cLynN8kVTcjhYV16M9RTaZtZvKAjJFlA&s",
      FullDestination: "A 3-night cruise from Luxor to Aswan with stops at temples and historical sites.",
      itinerary: [
        "Day 1: Arrival in Luxor and embark on the cruise.",
        "Day 2: Visit the Karnak Temple and Luxor Temple.",
        "Day 3: Visit the Valley of the Kings and Hatshepsut Temple.",
        "Day 4: Disembark in Aswan and visit the Philae Temple and High Dam.",
      ],
      accommodations: "Luxury cabin with en-suite bathroom and air conditioning.",
      difficulty: "Easy to moderate",
      reviews: [
        {
          text: "Great trip!",
          date: "4/19/2025, 10:30:00 AM",
          rating: 4
        }
      ]
    },
    {
      Name: "Pyramids of Giza Tour",
      Destination: "Giza",
      Price: "1200 EGP",
      category: "Historical",
      AvailableSeats: 10,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk82SupbRZJyU-GjQnsblWANhfT6izoyM2wA&s",
      FullDestination: "Explore the wonders of the pyramids, the Sphinx, and the Egyptian Museum.",
      itinerary: [
        "Day 1: Visit the Great Pyramid of Giza, Sphinx, and Egyptian Museum.",
        "Day 2: Optional camel ride around the pyramids and visit to local markets.",
      ],
      accommodations: "Hotel near Giza with breakfast included.",
      difficulty: "Moderate (walking involved)",
      reviews: [
        {
          text: "Good trip!",
          date: "4/10/2025, :30:00 AM",
          rating: 3
        }
      ]
    },
    {
      Name: "Red Sea Diving Expedition",
      Destination: "Sharm El Sheikh",
      Price: "3800 EGP",
      category: "Adventure",
      AvailableSeats: 12,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeNN72ZxZ9Vbd1dHF2l8Cid5kbtMe5NnC-Qg&s",
      FullDestination: "Explore the crystal-clear waters of the Red Sea with guided diving tours.",
      itinerary: [
        "Day 1: Arrival in Sharm El Sheikh and check-in at the resort.",
        "Day 2: Morning and afternoon diving sessions at popular diving spots.",
        "Day 3: Visit Ras Mohamed National Park for more diving and snorkeling.",
        "Day 4: Free day for relaxing at the beach.",
      ],
      accommodations: "5-star resort with pool and beach access.",
      difficulty: "Moderate to advanced (diving experience required)",
     reviews:[],
    },
  ]);
   const [bookings, setBookings] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showBookingList, setShowBookingList] = useState(false);


  const filteredTrips = trips
    .filter((trip) => {
      const priceValue = parseFloat(trip.Price.replace(/[^\d.]/g, ""));
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      return priceValue >= min && priceValue <= max;
    })
    .filter((trip) => (categoryFilter ? trip.category === categoryFilter : true))
    .filter((trip) => {
      const query = searchQuery.toLowerCase();
      return (
        trip.Name.toLowerCase().includes(query) ||
        trip.Destination.toLowerCase().includes(query) ||
        trip.category.toLowerCase().includes(query) ||
        trip.Price.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.Name.localeCompare(b.Name);
      if (sortBy === "price") {
        const priceA = parseFloat(a.Price.replace(/[^\d.]/g, ""));
        const priceB = parseFloat(b.Price.replace(/[^\d.]/g, ""));
        return priceA - priceB;
      }
      if (sortBy === "seats") return b.AvailableSeats - a.AvailableSeats;
      return 0;
    });

  const handleViewDetails = (trip) => {
    setSelectedTrip(trip);
    setShowDetails(true);
    setShowReviews(false);
  };

  const handleViewReviews = (trip) => {
    setSelectedTrip(trip);
    setShowReviews(true);
    setShowDetails(false);
  };

  const handleBack = () => {
    setSelectedTrip(null);
    setShowDetails(false);
    setShowReviews(false);
  };

  const handleAddReview = () => {
    if (!reviewText.trim()) {
      alert("Please write a review before submitting.");
      return;
    }
    if (rating === 0) {
      alert("Please give a rating before submitting.");
      return;
    }

    const updatedTrips = trips.map((trip) =>
      trip.Name === selectedTrip.Name
        ? {
            ...trip,
            reviews: [
              ...trip.reviews,
              { text: reviewText, date: new Date().toLocaleString(), rating },
            ],
          }
        : trip
    );

    setTrips(updatedTrips);
    alert("Review added successfully!");
    setReviewText("");
    setRating(0);
  };

  return (
    <div className="fulltouristhome-container">
      <div className="touristhome-container" style={{ backgroundImage: `url(${Touristhome})` }}></div>

      <div className="tourdetail">
        <h1 style={{ textAlign: "center", margin: "20px", color: "#007bff" }}>Available Trips</h1>

        <div className="filters" style={{ margin: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Cruise">Cruise</option>
            <option value="Historical">Historical</option>
            <option value="Adventure">Adventure</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="seats">Available Seats</option>
          </select>
        </div>

        <div className="trip-container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {filteredTrips.map((trip) => (
            <div key={trip.Name} className="tourist-card">
              <h3>{trip.Name}</h3>
              <p><strong>Destination:</strong> {trip.Destination}</p>
              <p><strong>Price:</strong> {trip.Price}</p>
              <p><strong>Available Seats:</strong> {trip.AvailableSeats}</p>
              <img src={trip.image} alt={trip.Name} />
              <div className="button-container">
                <button onClick={() => handleViewDetails(trip)}>View Details</button>
                <button
  onClick={() => handleViewReviews(trip)}
  style={{ backgroundColor: "#FADA5E" }}
>
  See Reviews
</button>

              </div>
            </div>
          ))}
        </div>

        {showDetails && selectedTrip && (
          <div className="trip-details">
            <h2>Trip Details: {selectedTrip.Name}</h2>
            <p><strong>Destination:</strong> {selectedTrip.Destination}</p>
            <p><strong>Price:</strong> {selectedTrip.Price}</p>
            <p><strong>Category:</strong> {selectedTrip.category}</p>
            <p><strong>Accommodations:</strong> {selectedTrip.accommodations}</p>
            <p><strong>Difficulty:</strong> {selectedTrip.difficulty}</p>
            <p><strong>Full Description:</strong> {selectedTrip.FullDestination}</p>
            <h3>Itinerary:</h3>
            <ul>
              {selectedTrip.itinerary.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
         

            <button 
  onClick={() => setShowBookingForm(true)} 
  style={{
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginRight: '10px',
  }}
>
  Book
</button>

{showBookingForm && (
  <div>
    <button  className="back-button"
      onClick={() => setShowBookingForm(false)} 
      style={{
        padding: '10px 20px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
      }}
    >
      Back
    </button>
    <Bookingform
      trip={selectedTrip}
      addBooking={(booking) => {
        setBookings([...bookings, booking]);
        alert(`Trip "${booking.tripName}" booked successfully!`);
        setShowBookingForm(false);
        setShowDetails(false);
        setSelectedTrip(null);
      }}
    />
  </div>
)}


            <button onClick={handleBack}     style={{
        padding: '10px 20px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
      }}>
              Back
            </button>
          </div>
        )}
       

{showReviews && (
  <div className="review-section">
    <h3 className="review-title">Reviews</h3>
    {selectedTrip && selectedTrip.reviews && selectedTrip.reviews.length > 0 ? (
      selectedTrip.reviews.map((review, idx) => (
        <div key={idx} className="review-box">
          <h4 className="review-heading">Review {idx + 1}</h4>
          <div className="review-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={star <= review.rating ? "star-filled" : "star-empty"}>
                ★
              </span>
            ))}
          </div>
          <p className="review-text">{review.text}</p>
          <p className="review-date"><small>{review.date}</small></p>
        </div>
      ))
    ) : (
      <p className="no-reviews">No reviews yet for this trip.</p>
    )}

    <button className="back-button" onClick={handleBack}>
      Back
    </button>
  </div>
)}
<button
  onClick={() => setShowBookingList(!showBookingList)}
  style={{
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
     marginLeft:"630px"
  }}
>
  See Booking List
</button>



        {showBookingList && (
          <div>
            <BookingList
              bookings={bookings}
              cancelBooking={(id) => {
                const updated = bookings.map((b) => b.id === id ? { ...b, status: "Cancelled" } : b);
                setBookings(updated);
              }}
              confirmBooking={(id) => {
                const updated = bookings.map((b) => b.id === id ? { ...b, status: "Confirmed" } : b);
                setBookings(updated);
              }}
              trips={trips}
              setTrips={setTrips}
            />
            <button
              onClick={() => setShowBookingList(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                marginTop: '20px',
                marginLeft:'1200px'
              }}
            >
              Back
            </button>
          </div>
        )}
      </div>
      <div>
        <Link to="/login" className="logouttourist">LOGOUT</Link>
      </div>
    </div>
  );
};


export default TouristHome;


// ============== the real one

// import React, { useState, useEffect } from "react";
// import BookingList from "./BookingList";
// import Touristhome from "./Touristhome.jpg";
// import "./TouristHome.css";
// import Bookingform from "./Bookingform";
// import { Link } from "react-router-dom";

// const TouristHome = () => {
//   const [trips, setTrips] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [selectedTrip, setSelectedTrip] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);
//   const [showReviews, setShowReviews] = useState(false);
//   const [reviewText, setReviewText] = useState("");
//   const [rating, setRating] = useState(0);
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBy, setSortBy] = useState("");
//   const [showBookingForm, setShowBookingForm] = useState(false);
//   const [showBookingList, setShowBookingList] = useState(false);

//   // Fetch trips data from API
//   useEffect(() => {
//     fetch("https://jsonplaceholder.typicode.com/posts")  // Replace with actual API link
//       .then((response) => response.json())
//       .then((data) => {
//         const formattedTrips = data.slice(0, 3).map((item) => ({
//           Name: item.title,
//           Destination: "Placeholder Destination",
//           Price: "1000 EGP",
//           category: "Adventure",
//           AvailableSeats: 20,
//           image: "https://via.placeholder.com/150",
//           FullDestination: item.body,
//           itinerary: ["Day 1: Explore", "Day 2: Relax"],
//           accommodations: "Basic accommodations",
//           difficulty: "Easy",
//           reviews: [],
//         }));
//         setTrips(formattedTrips);
//       })
//       .catch((error) => console.error("Error fetching trips:", error));
//   }, []);

//   const filteredTrips = trips
//     .filter((trip) => {
//       const priceValue = parseFloat(trip.Price.replace(/[^\d.]/g, ""));
//       const min = minPrice ? parseFloat(minPrice) : 0;
//       const max = maxPrice ? parseFloat(maxPrice) : Infinity;
//       return priceValue >= min && priceValue <= max;
//     })
//     .filter((trip) => (categoryFilter ? trip.category === categoryFilter : true))
//     .filter((trip) => {
//       const query = searchQuery.toLowerCase();
//       return (
//         trip.Name.toLowerCase().includes(query) ||
//         trip.Destination.toLowerCase().includes(query) ||
//         trip.category.toLowerCase().includes(query) ||
//         trip.Price.toLowerCase().includes(query)
//       );
//     })
//     .sort((a, b) => {
//       if (sortBy === "name") return a.Name.localeCompare(b.Name);
//       if (sortBy === "price") {
//         const priceA = parseFloat(a.Price.replace(/[^\d.]/g, ""));
//         const priceB = parseFloat(b.Price.replace(/[^\d.]/g, ""));
//         return priceA - priceB;
//       }
//       if (sortBy === "seats") return b.AvailableSeats - a.AvailableSeats;
//       return 0;
//     });

//   const handleViewDetails = (trip) => {
//     setSelectedTrip(trip);
//     setShowDetails(true);
//     setShowReviews(false);
//   };

//   const handleViewReviews = (trip) => {
//     setSelectedTrip(trip);
//     setShowReviews(true);
//     setShowDetails(false);
//   };

//   const handleBack = () => {
//     setSelectedTrip(null);
//     setShowDetails(false);
//     setShowReviews(false);
//   };

//   const handleAddReview = () => {
//     if (!reviewText.trim()) {
//       alert("Please write a review before submitting.");
//       return;
//     }
//     if (rating === 0) {
//       alert("Please give a rating before submitting.");
//       return;
//     }

//     const updatedTrips = trips.map((trip) =>
//       trip.Name === selectedTrip.Name
//         ? {
//             ...trip,
//             reviews: [
//               ...trip.reviews,
//               { text: reviewText, date: new Date().toLocaleString(), rating },
//             ],
//           }
//         : trip
//     );

//     setTrips(updatedTrips);
//     alert("Review added successfully!");
//     setReviewText("");
//     setRating(0);
//   };

//   return (
//     <div className="fulltouristhome-container">
//       <div className="touristhome-container" style={{ backgroundImage: `url(${Touristhome})` }}></div>

//       <div className="tourdetail">
//         <h1 style={{ textAlign: "center", margin: "20px", color: "#007bff" }}>Available Trips</h1>

//         <div className="filters" style={{ margin: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
//           <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
//           <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
//           <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
//           <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
//             <option value="">All Categories</option>
//             <option value="Cruise">Cruise</option>
//             <option value="Historical">Historical</option>
//             <option value="Adventure">Adventure</option>
//           </select>
//           <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//             <option value="">Sort By</option>
//             <option value="name">Name</option>
//             <option value="price">Price</option>
//             <option value="seats">Available Seats</option>
//           </select>
//         </div>

//         <div className="trip-container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
//           {filteredTrips.map((trip) => (
//             <div key={trip.Name} className="tourist-card">
//               <h3>{trip.Name}</h3>
//               <p><strong>Destination:</strong> {trip.Destination}</p>
//               <p><strong>Price:</strong> {trip.Price}</p>
//               <p><strong>Available Seats:</strong> {trip.AvailableSeats}</p>
//               <img src={trip.image} alt={trip.Name} />
//               <div className="button-container">
//                 <button onClick={() => handleViewDetails(trip)}>View Details</button>
//                 <button onClick={() => handleViewReviews(trip)} style={{ backgroundColor: "#FADA5E" }}>
//                   See Reviews
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {showDetails && selectedTrip && (
//           <div className="trip-details">
//             <h2>Trip Details: {selectedTrip.Name}</h2>
//             <p><strong>Destination:</strong> {selectedTrip.Destination}</p>
//             <p><strong>Price:</strong> {selectedTrip.Price}</p>
//             <p><strong>Category:</strong> {selectedTrip.category}</p>
//             <p><strong>Accommodations:</strong> {selectedTrip.accommodations}</p>
//             <p><strong>Difficulty:</strong> {selectedTrip.difficulty}</p>
//             <p><strong>Full Description:</strong> {selectedTrip.FullDestination}</p>
//             <h3>Itinerary:</h3>
//             <ul>
//               {selectedTrip.itinerary.map((item, index) => (
//                 <li key={index}>{item}</li>
//               ))}
//             </ul>

//             <button 
//               onClick={() => setShowBookingForm(true)} 
//               style={{
//                 padding: '10px 20px',
//                 backgroundColor: '#007bff',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '5px',
//                 cursor: 'pointer',
//                 fontSize: '16px',
//                 marginRight: '10px',
//               }}
//             >
//               Book
//             </button>

//             {showBookingForm && (
//               <div>
//                 <button className="back-button"
//                   onClick={() => setShowBookingForm(false)} 
//                   style={{
//                     padding: '10px 20px',
//                     backgroundColor: '#f44336',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '5px',
//                     cursor: 'pointer',
//                     fontSize: '16px',
//                   }}
//                 >
//                   Back
//                 </button>
//                 <Bookingform
//                   trip={selectedTrip}
//                   addBooking={(booking) => {
//                     setBookings([...bookings, booking]);
//                     alert(`Trip "${booking.tripName}" booked successfully!`);
//                     setShowBookingForm(false);
//                     setShowDetails(false);
//                     setSelectedTrip(null);
//                   }}
//                 />
//               </div>
//             )}

//             <button onClick={handleBack} style={{
//               padding: '10px 20px',
//               backgroundColor: '#f44336',
//               color: 'white',
//               border: 'none',
//               borderRadius: '5px',
//               cursor: 'pointer',
//               fontSize: '16px',
//             }}>
//               Back
//             </button>
//           </div>
//         )}

//         {showReviews && (
//           <div className="review-section">
//             <h3 className="review-title">Reviews</h3>
//             {selectedTrip && selectedTrip.reviews && selectedTrip.reviews.length > 0 ? (
//               selectedTrip.reviews.map((review, idx) => (
//                 <div key={idx} className="review-box">
//                   <h4 className="review-heading">Review {idx + 1}</h4>
//                   <div className="review-stars">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <span key={star} className={star <= review.rating ? "star-filled" : "star-empty"}>
//                         ★
//                       </span>
//                     ))}
//                   </div>
//                   <p className="review-text">{review.text}</p>
//                   <p className="review-date"><small>{review.date}</small></p>
//                 </div>
//               ))
//             ) : (
//               <p className="no-reviews">No reviews yet for this trip.</p>
//             )}

//             <button className="back-button" onClick={handleBack}>
//               Back
//             </button>
//           </div>
//         )}
//         <button
//           onClick={() => setShowBookingList(!showBookingList)}
//           style={{
//             padding: '10px 20px',
//             backgroundColor: '#007bff',
//             color: 'white',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//             fontSize: '16px',
//             marginTop: '20px',
//             marginLeft: "630px",
//           }}
//         >
//           See Booking List
//         </button>

//         {showBookingList && (
//           <div>
//             <BookingList
//               bookings={bookings}
//               cancelBooking={(id) => {
//                 const updated = bookings.map((b) => b.id === id ? { ...b, status: "Cancelled" } : b);
//                 setBookings(updated);
//               }}
//               confirmBooking={(id) => {
//                 const updated = bookings.map((b) => b.id === id ? { ...b, status: "Confirmed" } : b);
//                 setBookings(updated);
//               }}
//               trips={trips}
//               setTrips={setTrips}
//             />
//             <button
//               onClick={() => setShowBookingList(false)}
//               style={{
//                 padding: '10px 20px',
//                 backgroundColor: '#f44336',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '5px',
//                 cursor: 'pointer',
//                 fontSize: '16px',
//                 marginTop: '20px',
//                 marginLeft:'1200px'
//               }}
//             >
//               Back
//             </button>
//           </div>
//         )}
//       </div>
//       <div>
//         <Link to="/login" className="logouttourist">LOGOUT</Link>
//       </div>
//     </div>
//   );
// };

// export default TouristHome;
