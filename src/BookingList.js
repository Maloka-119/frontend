import React, { useState } from "react";
import api from "./api";

const BookingList = ({ bookings, onBookingUpdate }) => {
  const [reviewingBookingId, setReviewingBookingId] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReviewChange = (e) => setReviewText(e.target.value);
  const handleRatingClick = (star) => setRating(star);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      setLoading(true);
      await api.delete(`/bookings/${bookingId}`);
      onBookingUpdate(); // Refresh bookings list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel booking");
      console.error("Cancel booking error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (bookingId) => {
    if (!reviewText.trim()) {
      setError("Please enter a review before submitting.");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/bookings/${bookingId}/reviews`, {
        text: reviewText,
        rating
      });
      
      // Reset form and refresh data
      setReviewText("");
      setRating(0);
      setReviewingBookingId(null);
      onBookingUpdate(); // Refresh bookings list
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
      console.error("Submit review error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-list">
      <h2 style={{ marginBottom: "20px" }}>My Bookings</h2>
      
      {error && <div className="error-message" style={{ color: "red", marginBottom: "15px" }}>{error}</div>}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Trip Name</th>
            <th style={tableHeaderStyle}>Booking Date</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Actions</th>
            <th style={tableHeaderStyle}>Review</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} style={tableRowStyle}>
              <td style={tableCellStyle}>{booking.trip.name}</td>
              <td style={tableCellStyle}>
                {new Date(booking.createdAt).toLocaleDateString()}
              </td>
              <td style={tableCellStyle}>
                <span style={{
                  color: booking.status === 'CONFIRMED' ? 'green' : 
                        booking.status === 'CANCELLED' ? 'red' : 'orange',
                  fontWeight: 'bold'
                }}>
                  {booking.status}
                </span>
              </td>
              <td style={tableCellStyle}>
                {booking.status === "PENDING" && (
                  <button
                    onClick={() => cancelBooking(booking.id)}
                    style={{ ...buttonStyle, backgroundColor: "#f44336" }}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Cancel"}
                  </button>
                )}
                {booking.status === "CONFIRMED" && !booking.review && (
                  <button
                    onClick={() => setReviewingBookingId(reviewingBookingId === booking.id ? null : booking.id)}
                    style={buttonStyle}
                    disabled={loading}
                  >
                    {reviewingBookingId === booking.id ? "Close" : "Add Review"}
                  </button>
                )}
              </td>
              <td style={tableCellStyle}>
                {booking.review ? (
                  <div>
                    <strong>Your Review:</strong>
                    <p>{booking.review.text}</p>
                    <div>
                      Rating: {Array(booking.review.rating).fill("★").join("")}
                    </div>
                  </div>
                ) : reviewingBookingId === booking.id && (
                  <div style={{ marginTop: "10px" }}>
                    <textarea
                      value={reviewText}
                      onChange={handleReviewChange}
                      placeholder="Share your experience..."
                      rows="3"
                      style={textareaStyle}
                      disabled={loading}
                    />
                    <div style={{ margin: "10px 0" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => !loading && handleRatingClick(star)}
                          style={{
                            cursor: loading ? "not-allowed" : "pointer",
                            color: star <= rating ? "#FFD700" : "#ccc",
                            fontSize: "20px",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => submitReview(booking.id)}
                      style={submitButtonStyle}
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit Review"}
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

// Styles (same as before)
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