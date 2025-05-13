import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TouristHome.css";
import Touristhome from "./Touristhome.jpg";

const TouristHome = () => {
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    tripId: "",
    customerName: "",
    email: "",
    phoneNumber: "",
    numberOfSeats: 1
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(-1);
  };

  const categoryImages = {
    "Eco Tours": "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
    "Water Sports": "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    "Wellness Retreats": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    "River Cruises": "https://images.unsplash.com/photo-1503917988258-f87a78e3c995?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    "Mountain Adventures": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    "Desert Tours": "https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    "Historical Tours": "https://images.unsplash.com/photo-1528181304800-259b08848526",
    "Adventure Tours": "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    "Beach Holidays": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    "Cultural Tours": "https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  };

  useEffect(() => {
    fetch("https://localhost:7050/api/TripPackage", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        const tripsWithReviews = data.map(trip => ({
          ...trip,
          reviews: [
            {
              text: "Great experience! Highly recommended.",
              rating: 5,
              date: "2023-05-15"
            },
            {
              text: "Had a wonderful time with my family.",
              rating: 4,
              date: "2023-06-20"
            }
          ]
        }));
        setTrips(tripsWithReviews);
      })
      .catch((error) => console.error("Error fetching trips:", error));

    // Fetch bookings
    fetch("https://localhost:7050/api/Booking", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => response.json())
      .then((data) => setBookings(data))
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);

  const filteredTrips = trips
    .filter((trip) => {
      const priceValue = parseFloat(trip.price);
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      return priceValue >= min && priceValue <= max;
    })
    .filter((trip) => {
      if (!searchQuery) return true;
      return (
        trip.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.price?.toString().includes(searchQuery)
      );
    })
    .filter((trip) => {
      if (!categorySearch) return true;
      return trip.category?.toLowerCase().includes(categorySearch.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "price") return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === "seats") return b.availableSeats - a.availableSeats;
      return 0;
    });

  const handleViewDetails = (trip) => {
    setSelectedTrip(trip);
    setShowDetails(true);
    setShowReviews(false);
    setShowBookingForm(false);
  };

  const handleViewReviews = (trip) => {
    setSelectedTrip(trip);
    setShowReviews(true);
    setShowDetails(false);
    setShowBookingForm(false);
  };

  const handleBookingForm = (trip) => {
    setSelectedTrip(trip);
    setBookingData({
      ...bookingData,
      tripId: trip.tripId
    });
    setShowBookingForm(true);
    setShowDetails(false);
    setShowReviews(false);
  };

  const handleBack = () => {
    setSelectedTrip(null);
    setShowDetails(false);
    setShowReviews(false);
    setShowBookingForm(false);
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value
    });
  };

const handleBookingSubmit = (e) => {
  e.preventDefault();
  
  // Prepare the booking data according to the API structure
  const bookingPayload = {
    touristId: 0, // You'll need to replace this with actual tourist ID
    tourPackageId: selectedTrip.tripId,
    bookingDate: new Date().toISOString(),
    status: "Pending",
    userName: bookingData.customerName,
    emailAddress: bookingData.email,
    phoneNumber: bookingData.phoneNumber
  };

  fetch("https://localhost:7050/api/Booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(bookingPayload)
  })
  .then(async (response) => {
    const text = await response.text();
    if (!response.ok) {
      // Try to parse the error message if it's JSON
      try {
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || errorData.title || "Booking failed");
      } catch {
        // If not JSON, use the raw text as error message
        throw new Error(text || "Booking failed");
      }
    }
    return text ? JSON.parse(text) : {};
  })
  .then(data => {
    alert("Booking successful!");
    setShowBookingForm(false);
    // Refresh bookings list
    return fetch("https://localhost:7050/api/Booking", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  })
  .then(response => response.json())
  .then(data => setBookings(data))
  .catch(error => {
    console.error("Error making booking:", error);
    alert(`Booking failed: ${error.message}`);
  });
};
  const handleCancelBooking = (bookingId) => {
    fetch(`https://localhost:7050/api/Booking/${bookingId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(response => {
        if (response.ok) {
          setBookings(bookings.filter(booking => booking.bookingId !== bookingId));
          alert("Booking cancelled successfully");
        } else {
          throw new Error("Failed to cancel booking");
        }
      })
      .catch(error => {
        console.error("Error cancelling booking:", error);
        alert("Failed to cancel booking");
      });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "star-filled" : "star-empty"}>
          {i <= rating ? "★" : "☆"}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="fulltouristhome-container">
      <div className="header-actions">
        <button className="logouttourist button" onClick={handleLogout}>
          LOGOUT
        </button>
        <button 
          className="booking-list-button button"
          onClick={() => {
            setShowBookingForm(false);
            setShowDetails(false);
            setShowReviews(false);
          }}
        >
          See Booking List
        </button>
      </div>

      <div className="touristhome-container" style={{ backgroundImage: `url(${Touristhome})` }}></div>
      <div className="tourdetail">
        <h1 className="tourdetail-title">Available Trips</h1>
        
        <div className="filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="price-filter">
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div className="category-filter">
            <input
              type="text"
              placeholder="Search by Category"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
            />
          </div>
          <div className="sort-section">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">Sort By</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="seats">Available Seats</option>
            </select>
          </div>
        </div>

        {!showDetails && !showReviews && !showBookingForm && (
          <div className="trip-container">
            {filteredTrips.map((trip) => (
              <div key={trip.tripId} className="tourist-card">
                <img src={categoryImages[trip.category] || ""} alt={trip.title} />
                <h3>{trip.title}</h3>
                <p>Available Seats: {trip.availableSeats}</p>
                <div className="button-container">
                  <button 
                    className="button details-button"
                    onClick={() => handleViewDetails(trip)}
                  >
                    View Details
                  </button>
                  <button 
                    className="button book-button"
                    onClick={() => handleBookingForm(trip)}
                  >
                    Book Now
                  </button>
                  <button 
                    className="button reviews-button"
                    onClick={() => handleViewReviews(trip)}
                  >
                    See Reviews
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showDetails && selectedTrip && (
          <div className="trip-details">
            <h2>{selectedTrip.title}</h2>
            <p><strong>Description:</strong> {selectedTrip.description}</p>
            <p><strong>Destination:</strong> {selectedTrip.destination}</p>
            <p><strong>Price:</strong> {selectedTrip.price} EGP</p>
            <p><strong>Available Seats:</strong> {selectedTrip.availableSeats}</p>
            <p><strong>Category:</strong> {selectedTrip.category}</p>
            <div className="action-buttons">
              <button className="button back-button" onClick={handleBack}>
                Back
              </button>
              <button 
                className="button book-button"
                onClick={() => handleBookingForm(selectedTrip)}
              >
                Book Now
              </button>
            </div>
          </div>
        )}

        {showReviews && selectedTrip && (
          <div className="review-section">
            <h2 className="review-title">Reviews for {selectedTrip.title}</h2>
            {selectedTrip.reviews && selectedTrip.reviews.length > 0 ? (
              selectedTrip.reviews.map((review, index) => (
                <div key={index} className="review-box">
                  <div className="review-heading">
                    <div className="review-stars">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="review-text">{review.text}</p>
                  <p className="review-date">{review.date}</p>
                </div>
              ))
            ) : (
              <p className="no-reviews">No reviews yet.</p>
            )}
            <button className="button back-button" onClick={handleBack}>
              Back
            </button>
          </div>
        )}

        {showBookingForm && (
          <div className="booking-form-section">
            <h2>Booking Form</h2>
            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label>Trip:</label>
                <input 
                  type="text" 
                  value={selectedTrip?.title || ""} 
                  readOnly 
                />
              </div>
              <div className="form-group">
                <label>Your Name:</label>
                <input
                  type="text"
                  name="customerName"
                  value={bookingData.customerName}
                  onChange={handleBookingChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={bookingData.email}
                  onChange={handleBookingChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={bookingData.phoneNumber}
                  onChange={handleBookingChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Number of Seats:</label>
                <input
                  type="number"
                  name="numberOfSeats"
                  min="1"
                  max={selectedTrip?.availableSeats || 10}
                  value={bookingData.numberOfSeats}
                  onChange={handleBookingChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="button submit-button">
                  Confirm Booking
                </button>
                <button 
                  type="button" 
                  className="button back-button"
                  onClick={handleBack}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {!showDetails && !showReviews && !showBookingForm && (
          <div className="my-bookings-section">
            <h2>My Bookings</h2>
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Trip Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.bookingId}>
                    <td>{booking.tripName || "N/A"}</td>
                    <td>{booking.status || "Pending"}</td>
                    <td>
                      <button 
                        className="button cancel-button"
                        onClick={() => handleCancelBooking(booking.bookingId)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristHome;