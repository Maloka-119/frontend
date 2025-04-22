import React, { useState } from "react";

const Bookingform = ({ trip, addBooking }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [seats, setSeats] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!name || !email || !phone) {
      alert("Please fill out all fields.");
      return;
    }

    if (seats < 1 || seats > trip.AvailableSeats) {
      alert("Invalid number of seats.");
      return;
    }

    const booking = {
      id: new Date().getTime(), // unique ID for each booking
      tripName: trip.Name,
      userName: name,
      userEmail: email,
      userPhone: phone,
      seatsBooked: seats,
      status: "Pending", // New booking status
    };

    addBooking(booking); // Add the booking to the parent component

    // Reset the form
    setName("");
    setEmail("");
    setPhone("");
    setSeats(1);
  };

  return (
    <div className="booking-form">
      <h2>Booking Form for {trip.Name}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>
        <div>
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <button type="submit">Submit Booking</button>
      </form>
    </div>
  );
};

export default Bookingform;



