import React, { useEffect, useState } from "react";
import './ManageAgencies.css';
import AgencyImage from './Aganceman.jpg';

const ManageAgencies = () => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState({
    table: true,
    form: false,
    actions: {}
  });
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [newAgency, setNewAgency] = useState({
    agencyName: "",
    email: "",
    password: "",
    confirmPassword: "", 
    address: "",
  });

  useEffect(() => {
    const fetchAgencies = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token missing. Please login again.");
        setLoading(prev => ({...prev, table: false}));
        return;
      }

      try {
        const response = await fetch("https://localhost:7050/api/Agency", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        const responseText = await response.text();
        
        if (!response.ok) {
          throw new Error(responseText || `Server responded with ${response.status}`);
        }

        const data = responseText ? JSON.parse(responseText) : [];
        
        if (!Array.isArray(data)) {
          throw new Error("Expected array of agencies but got: " + typeof data);
        }

        // Format the data to match our expected structure
        const formattedAgencies = data.map(agency => ({
          id: agency.id,
          agencyName: agency.agencyName,
          email: agency.agencyEmail, // Map agencyEmail to email
          phoneNumber: agency.phoneNumber,
          address: agency.address,
          isApproved: agency.isApproved
        }));

        setAgencies(formattedAgencies);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(`Error loading agencies: ${err.message}`);
      } finally {
        setLoading(prev => ({...prev, table: false}));
      }
    };

    fetchAgencies();
  }, [successMessage]);

  const handleAgencyAction = async (agencyId, action) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token missing. Please login again.");
      return;
    }

    setLoading(prev => ({...prev, actions: {...prev.actions, [agencyId]: true}}));

    try {
      let endpoint = "";
      let method = "PUT";
      
      switch(action) {
        case "approve":
          endpoint = `https://localhost:7050/api/Agency/${agencyId}/approve`;
          break;
        case "reject":
          endpoint = `https://localhost:7050/api/Agency/${agencyId}/reject`;
          break;
        case "delete":
          endpoint = `https://localhost:7050/api/Agency/${agencyId}`;
          method = "DELETE";
          break;
        default:
          throw new Error("Invalid action");
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        throw new Error(responseText || `Action failed with status ${response.status}`);
      }

      setSuccessMessage(`Agency ${action}d successfully!`);
      
      // Refresh agencies list after action
      if (action === "delete") {
        setAgencies(prev => prev.filter(agency => agency.id !== agencyId));
      } else {
        setAgencies(prev => prev.map(agency => {
          if (agency.id === agencyId) {
            return {
              ...agency,
              isApproved: action === "approve"
            };
          }
          return agency;
        }));
      }
      
    } catch (err) {
      console.error("Action error:", err);
      setError(`Failed to ${action} agency: ${err.message}`);
    } finally {
      setLoading(prev => ({...prev, actions: {...prev.actions, [agencyId]: false}}));
    }
  };

  const handleCreateAgency = async () => {
    setFormError("");
    setSuccessMessage("");
    setLoading(prev => ({...prev, form: true}));

    const { agencyName, email, password, confirmPassword, address } = newAgency;
    
    if (!agencyName.trim() || !email.trim() || !password || !address.trim()) {
      setFormError("All fields are required");
      setLoading(prev => ({...prev, form: false}));
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      setLoading(prev => ({...prev, form: false}));
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setFormError("Authentication token missing. Please login again.");
      setLoading(prev => ({...prev, form: false}));
      return;
    }

    try {
      const requestData = {
        agencyName: agencyName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        isApproved: true,
        address: address.trim()
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch("https://localhost:7050/api/Agency/add-with-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestData),
        signal: controller.signal
      });

      clearTimeout(timeout);

      const responseText = await response.text();

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          if (errorData.errors) {
            const errorMessages = Object.values(errorData.errors).flat();
            throw new Error(errorMessages.join("\n"));
          }
          throw new Error(errorData.title || errorData.message || "Request failed");
        } catch (e) {
          throw new Error(responseText || `HTTP ${response.status}`);
        }
      }

      const responseData = responseText ? JSON.parse(responseText) : {};
      
      setNewAgency({
        agencyName: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: ""
      });
      
      setSuccessMessage("Agency created successfully!");
      // Refresh the agencies list
      setLoading(prev => ({...prev, table: true}));

    } catch (err) {
      let errorMsg = "Failed to create agency";
      
      if (err.name === 'AbortError') {
        errorMsg = "Request timed out (10s). Check if server is running.";
      } 
      else if (err.message.includes("NetworkError")) {
        errorMsg = "Cannot connect to server. Ensure server is running and CORS is configured";
      }
      else if (err.message.includes("duplicate")) {
        errorMsg = "Email already exists. Please use a different email.";
        setNewAgency(prev => ({...prev, email: ""}));
      }
      else {
        errorMsg = err.message;
      }

      setFormError(errorMsg);
    } finally {
      setLoading(prev => ({...prev, form: false}));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAgency(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="manage-agencies-container" style={{ backgroundImage: `url(${AgencyImage})` }}>
      

      <h2 style={{color:"white"}}>Manage Agencies</h2>

      <div className="create-agency-form">
        <h3 style={{ color: "white" }}>Create New Agency</h3>
        
        {formError && <div className="error-message">{formError}</div>}

        <input
          type="text"
          name="agencyName"
          placeholder="Agency Name"
          value={newAgency.agencyName}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Agency Email"
          value={newAgency.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={newAgency.password}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={newAgency.confirmPassword}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={newAgency.address}
          onChange={handleInputChange}
        />
        
        <button 
          onClick={handleCreateAgency}
          disabled={loading.form}
        >
          {loading.form ? "Processing..." : "Create Agency"}
        </button>
      </div>

      {loading.table ? (
        <div className="loading-message">Loading agencies...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="agencies-table-container">
          <table className="agencies-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agencies.length > 0 ? (
                agencies.map((agency) => (
                  <tr key={agency.id}>
                    <td>{agency.agencyName}</td>
                    <td>{agency. email  || 'N/A'}</td>
                    <td>{agency.isApproved ? "Approved" : "Pending"}</td>
                    <td className="actions-cell">
                      {!agency.isApproved && (
                        <button
                          className="approve-btn"
                          onClick={() => handleAgencyAction(agency.id, "approve")}
                          disabled={loading.actions[agency.id]}
                        >
                          {loading.actions[agency.id] ? "Processing..." : "Approve"}
                        </button>
                      )}
                      {agency.isApproved && (
                        <button
                          className="reject-btn"
                          onClick={() => handleAgencyAction(agency.id, "reject")}
                          disabled={loading.actions[agency.id]}
                        >
                          {loading.actions[agency.id] ? "Processing..." : "Reject"}
                        </button>
                      )}
                      <button
                        className="delete-btn"
                        onClick={() => handleAgencyAction(agency.id, "delete")}
                        disabled={loading.actions[agency.id]}
                      >
                        {loading.actions[agency.id] ? "Processing..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-agencies">No agencies found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageAgencies;


