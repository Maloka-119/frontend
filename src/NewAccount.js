import React, { useState } from "react";
import './NewAccount.css';
import Blueback from './Blueback.jpg';
import { useNavigate } from "react-router-dom";

const NewAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "Tourist",
    agencyName: "",
    agencyAddress: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    const userData = {
      UserName: formData.userName,
      Email: formData.email,
      Password: formData.password,
      PhoneNumber: formData.phoneNumber,
      Role: formData.role
    };

    if (formData.role === "TravelAgency") {
      if (!formData.agencyName || !formData.agencyAddress) {
        setError("Agency name and address are required for Travel Agency registration");
        setIsLoading(false);
        return;
      }
      userData.AgencyName = formData.agencyName;
      userData.AgencyAddress = formData.agencyAddress;
    }

    try {
      const response = await fetch("https://localhost:7050/api/Authentication/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      // Clone the response to read it multiple times if needed
      const responseClone = response.clone();
      
      // First try to parse as JSON
      try {
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || data.title || JSON.stringify(data.errors) || "Registration failed");
        }
        
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } catch (jsonError) {
        // If JSON parsing fails, try to read as text
        const textData = await responseClone.text();
        
        if (!response.ok) {
          throw new Error(textData || "Registration failed");
        }
        
        // If response is OK but not JSON, handle accordingly
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      let errorMsg = err.message;
      
      // Clean up error message
      if (errorMsg.startsWith("Unexpected token") || errorMsg.startsWith("User regis")) {
        errorMsg = "Registration failed. Please try again.";
      } else if (err.message.includes("Failed to fetch")) {
        errorMsg = "Cannot connect to server. Please try again later.";
      } else if (err.message.includes("User already exists")) {
        errorMsg = "This email is already registered. Please use a different email.";
      }
      
      setError(errorMsg);
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container" style={{ backgroundImage: `url(${Blueback})` }}>
      <div className="register-box">
        <h2>Create New Account</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>User Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="Tourist">Tourist</option>
              <option value="TravelAgency">Travel Agency</option>
            </select>
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
              minLength="3"
              placeholder="At least 3 characters"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@domain.com"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="e.g. +201234567890"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="At least 6 characters"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
            />
          </div>

          {formData.role === "TravelAgency" && (
            <>
              <div className="form-group">
                <label>Agency Name</label>
                <input
                  type="text"
                  name="agencyName"
                  value={formData.agencyName}
                  onChange={handleChange}
                  required
                  placeholder="Your agency name"
                />
              </div>

              <div className="form-group">
                <label>Agency Address</label>
                <input
                  type="text"
                  name="agencyAddress"
                  value={formData.agencyAddress}
                  onChange={handleChange}
                  required
                  placeholder="Your agency address"
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default NewAccount;