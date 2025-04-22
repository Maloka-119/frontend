import React, { useState } from "react";

const BookingList = ({ bookings, cancelBooking, confirmBooking, trips, setTrips }) => {
  const [reviewingBookingId, setReviewingBookingId] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [complaints, setComplaints] = useState({}); // complaint per booking
  const [showReviews, setShowReviews] = useState(false);

  const handleReviewChange = (e) => setReviewText(e.target.value);
  const handleRatingClick = (star) => setRating(star);

  const handleSubmitReview = (bookingId) => {
    if (!reviewText.trim()) {
      alert("Please enter a review before submitting.");
      return;
    }

    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const currentDate = new Date().toLocaleString();

    const updatedTrips = trips.map((trip) => {
      if (trip.Name === booking.tripName) {
        const newReview = {
          text: reviewText,
          date: currentDate,
          rating,
        };
        const newReviews = trip.reviews ? [...trip.reviews, newReview] : [newReview];
        return { ...trip, reviews: newReviews };
      }
      return trip;
    });

    setTrips(updatedTrips);
    setReviewText("");
    setRating(0);
    setReviewingBookingId(null);
    setShowReviews(true);
    alert("Review submitted!");
  };







  return (
    <div className="booking-list">
      <h2 style={{ marginBottom: "20px" }}>My Bookings</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Trip Name</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Actions</th>
            <th style={tableHeaderStyle}>Review</th>
             
           
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} style={tableRowStyle}>
              <td style={tableCellStyle}>{booking.tripName}</td>
              <td style={tableCellStyle}>{booking.status}</td>
              <td style={tableCellStyle}>
                {booking.status === "Pending" && (
                  <>
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      style={{ ...buttonStyle, backgroundColor: "#f44336" }}
                    >
                      Cancel
                    </button>
                   {/* <button
                      onClick={() => confirmBooking(booking.id)}
                      style={{ ...buttonStyle, backgroundColor: "#2196F3" }}
                    >
                      Confirm
                    </button>*//*kont bgarab el reviews bs */}
                  </>
                )}
                {booking.status === "Confirmed" && (
                  <button
                    onClick={() =>
                      setReviewingBookingId(
                        reviewingBookingId === booking.id ? null : booking.id
                      )
                    }
                    style={buttonStyle}
                  >
                    {reviewingBookingId === booking.id ? "Close Review" : "Add Review"}
                  </button>
                )}
              </td>
              <td style={tableCellStyle}>
                {reviewingBookingId === booking.id && (
                  <div style={{ marginTop: "10px" }}>
                    <textarea
                      value={reviewText}
                      onChange={handleReviewChange}
                      placeholder="Write your review here"
                      rows="3"
                      style={textareaStyle}
                    />
                    <div style={{ margin: "10px 0" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => handleRatingClick(star)}
                          style={{
                            cursor: "pointer",
                            color: star <= rating ? "#FFD700" : "#ccc",
                            fontSize: "20px",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleSubmitReview(booking.id)}
                      style={submitButtonStyle}
                    >
                      Submit Review
                    </button>
                  </div>
                )}
              </td>
 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styles
const tableHeaderStyle = {
  backgroundColor: "#f4f4f4",
  padding: "10px",
  textAlign: "left",
  borderBottom: "1px solid #ddd",
};

const tableRowStyle = {
  borderBottom: "1px solid #ddd",
};

const tableCellStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  verticalAlign: "top",
};

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "10px",
};

const textareaStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const submitButtonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "8px 12px",
  border: "none",
  cursor: "pointer",
  borderRadius: "6px",
};

export default BookingList;
