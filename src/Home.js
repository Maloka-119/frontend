import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';
import Beach from './Beach.jpg';

export default function Home() {
  const navigate = useNavigate();

  // Disable back button while on this page and scroll to the top
  useEffect(() => {
    // Scroll to the top of the page initially
    window.scrollTo(0, 0);

    // Add a new state to history to block back navigation
    window.history.pushState(null, "", window.location.href);

    // Prevent back navigation
    window.onpopstate = () => {
      // Reload the page to make sure it's loaded from the top
      window.location.reload();
    };

    // Clean up the onpopstate event on component unmount
    return () => {
      window.onpopstate = null;
    };
  }, []);

  const scrollToInfo = () => {
    const infoSection = document.getElementById("info-section");
    if (infoSection) {
      infoSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fullscreen-background">
      <div className="overlay-background" style={{ backgroundImage: `url(${Beach})` }}>
        <div className="welcome-message-box">
          <h1 style={{ color: "rgba(255, 255, 255, 0.767)" }}>Welcome to BooknGo</h1> <br />
          <div className="button-container" style={{ color: "rgba(255, 255, 255, 0.767)" }}>
            <button
              onClick={() => navigate("/login")}
              className="login-button"
              style={{
                backgroundColor: "#1580fa",
                color: 'white',
                border: 'none',
                padding: '20px 40px',
                borderRadius: '20px',
                width: '220px',
                height: '70px',
                cursor: 'pointer'
              }}
            >
              Login
            </button>
            <button
              onClick={scrollToInfo}
              className="learn-more-button"
              style={{
                background: '#f7cd29',
                border: '2px solid #f7cd29',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer'
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
      <div id="info-section" className="info-section">
        <div className="info-content">
          <h2>What is BooknGo?</h2>
          <p>
            BooknGo is a travel platform built for both tourists and travel agencies.
            Tourists can browse and book trips easily, track booking status, and leave honest reviews after traveling.
            Travel agencies can create and manage tour packages, handle bookings, and communicate directly with their clients.
            Admins oversee the system to keep everything running smoothly.
          </p>
          <p>
            With BooknGo, you get instant access to real-time trip availability and prices.
            You can filter tours by destination, category, or budget to find the perfect fit.
            All bookings are secure, and changes or cancellations are simple.
            Communication is clear and fast — agencies and tourists stay connected throughout the process.
          </p>
          <p>
            Whether you're booking your next getaway or managing multiple tour packages,
            BooknGo helps you stay organized, informed, and in control — all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
