// //test

// import React, { useEffect, useState } from "react";
// import './ManageAgencies.css';
// import Aganceman from './Aganceman.jpg';
// import BackiconAdmin from './BackiconAdmin.jpg';

// const ManageAgencies = () => {
//   const [agencies, setAgencies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [newAgency, setNewAgency] = useState({ name: "", email: "", address: "" });
//   const [formError, setFormError] = useState("");

//   useEffect(() => {
//     const fetchAgencies = async () => {
//       try {
//         const response = await fetch("https://localhost:7050/api/Agency");
//         const data = await response.json();
//         setAgencies(data);
//       } catch (err) {
//         setError("Failed to fetch agencies.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAgencies();
//   }, []);

//   const handleAction = async (id, action) => {
//     try {
//       const url = `https://localhost:7050/api/Agency/${id}`;
//       const method = action === "delete" ? "DELETE" : "PUT";

//       const response = await fetch(url, {
//         method: method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: action !== "delete" ? JSON.stringify({ status: action }) : null,
//       });

//       if (response.ok) {
//         if (action === "delete") {
//           setAgencies(agencies.filter((agency) => agency.id !== id));
//         } else {
//           const updatedAgencies = agencies.map((agency) =>
//             agency.id === id ? { ...agency, status: action } : agency
//           );
//           setAgencies(updatedAgencies);
//         }
//       } else {
//         setError("Failed to update agency status.");
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//       console.error(err);
//     }
//   };

//   const handleCreateAgency = async () => {
//     if (!newAgency.name || !newAgency.email || !newAgency.address) {
//       setFormError("Please fill in all fields.");
//       return;
//     }

//     try {
//         console.log("newAgency being sent:", newAgency);
//       const response = await fetch("https://localhost:7050/api/Agency", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newAgency),
//       });

//       if (response.ok) {
//         const createdAgency = await response.json();
//         setAgencies([...agencies, createdAgency]);
//         setNewAgency({ name: "", email: "", address: "" });
//         setFormError("");
//       } else {
//         setFormError("Failed to create agency.");
//       }
//     } catch (err) {
//       setFormError("Network error. Please try again.");
//       console.error(err);
//     }
//   };

//   // دالة لتحويل كائن العنوان إلى نص مفصل
//   const formatAddress = (address) => {
//     if (address && address.street && address.city) {
//       return `${address.street}, ${address.city}, ${address.zipcode}`;
//     }
//     return "No address";
//   };

//   return (
//     <div className="manage-agencies-container" style={{ backgroundImage: `url(${Aganceman})` }} >
//       <h2 style={{color:"white"}}>Manage Agencies</h2>

//       <div className="create-agency-form">
//         <h3 style={{color:"white"}}>Create New Agency</h3>
//         {formError && <p className="error-message">{formError}</p>}
//         <input
//           type="text"
//           placeholder="Agency Name"
//           value={newAgency.name}
//           onChange={(e) => setNewAgency({ ...newAgency, name: e.target.value })}
//         />
//         <input
//           type="email"
//           placeholder="Agency Email"
//           value={newAgency.email}
//           onChange={(e) => setNewAgency({ ...newAgency, email: e.target.value })}
//         />
        
//         <input
//           type="text"
//           placeholder="Agency Address"
//           value={newAgency.address}
//           onChange={(e) => setNewAgency({ ...newAgency, address: e.target.value })}
//         />
//         <button onClick={handleCreateAgency}>Create Agency</button>
//       </div>

//       {loading ? (
//         <p>Loading agencies...</p>
//       ) : error ? (
//         <p className="error-message">{error}</p>
//       ) : (
//         <table className="agencies-table">
//           <thead>
//             <tr>
//               <th>Agency Name</th>
//               <th>Email</th>
//               <th>Address</th> {/* إضافة عمود العنوان في الجدول */}
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {agencies.map((agency) => (
//               <tr key={agency.id}>
//                 <td>{agency.name}</td>
//                 <td>{agency.email}</td>
//                 {/* عرض العنوان كـ نص مفصل */}
//                 <td>{formatAddress(agency.address) || "No address"}</td>
//                 <td>{agency.status || "pending"}</td>
//                 <td>
//                   <button
//                     onClick={() => handleAction(agency.id, "approved")}
//                     disabled={agency.status === "approved"}
//                   >
//                     Approve
//                   </button>
//                   <button
//                     onClick={() => handleAction(agency.id, "rejected")}
//                     disabled={agency.status === "rejected"}
//                   >
//                     Reject
//                   </button>
//                   <button onClick={() => handleAction(agency.id, "delete")}>
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
      
//     </div>
//   );
// };

// export default ManageAgencies;


//last correct
import React, { useEffect, useState } from "react";
import './ManageAgencies.css';
import Aganceman from './Aganceman.jpg';

const ManageAgencies = () => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [newAgency, setNewAgency] = useState({
    userID: 5,          // معرّف المستخدم
    agencyName: "",     // اسم الوكالة
    agencyEmail: "",    // البريد الإلكتروني للوكالة
    address: "",        // عنوان الوكالة
  });

  // استرجاع التوكن من localStorage وتحويله من JSON string إلى كائن
  const storedToken = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    // التأكد من وجود التوكن قبل إجراء أي طلب
    if (!storedToken || !storedToken.tokenValue) {
      setError("Token is missing. Please log in again.");
      return; // عدم تنفيذ الطلب إذا لم يكن التوكن موجودًا
    }

    const fetchAgencies = async () => {
      try {
        const response = await fetch("https://localhost:7050/api/Agency", {
          headers: {
            Authorization: `Bearer ${storedToken.tokenValue.token}`, // إضافة التوكن في الترويسة
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch agencies.");
        }

        const data = await response.json();
        setAgencies(data);

        const maxId = data.length > 0 ? Math.max(...data.map(a => a.id)) : 0;
        setNewAgency(prev => ({ ...prev, agencyID: maxId + 1 }));
      } catch (err) {
        setError("Failed to fetch agencies.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);  // التأكد من استرجاع التوكن فقط مرة واحدة عند تحميل المكون

  const handleCreateAgency = async () => {
    if (!newAgency.agencyName || !newAgency.agencyEmail || !newAgency.address) {
      setFormError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("https://localhost:7050/api/Agency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken.tokenValue.token}`,
        },
        body: JSON.stringify({
          userID: 5,
          agencyName: newAgency.agencyName,
          agencyEmail: newAgency.agencyEmail,
          isApproved: false,
          address: newAgency.address
        })
      });

      if (response.ok) {
        const createdAgency = await response.json();
        setAgencies([...agencies, createdAgency]);

        setNewAgency(prev => ({
          ...prev,
          userID: 0,
          agencyName: "",
          agencyEmail: "",
          address: "",
        }));

        setFormError("");
      } else {
        const errorData = await response.json();
        setFormError(errorData.message || "Failed to create agency.");
      }
    } catch (err) {
      setFormError("Network error. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="manage-agencies-container" style={{ backgroundImage: `url(${Aganceman})` }}>
      <h2 style={{ color: "white" }}>Manage Agencies</h2>

      <div className="create-agency-form">
        <h3 style={{ color: "white" }}>Create New Agency</h3>
        {formError && <p className="error-message">{formError}</p>}

        <input
          type="text"
          placeholder="Agency Name"
          value={newAgency.agencyName}
          onChange={(e) => setNewAgency({ ...newAgency, agencyName: e.target.value })}
        />
        <input
          type="email"
          placeholder="Agency Email"
          value={newAgency.agencyEmail}
          onChange={(e) => setNewAgency({ ...newAgency, agencyEmail: e.target.value })}
        />
        <input
          type="text"
          placeholder="Agency Address"
          value={newAgency.address}
          onChange={(e) => setNewAgency({ ...newAgency, address: e.target.value })}
        />
        <button onClick={handleCreateAgency}>Create Agency</button>
      </div>

      {loading ? (
        <p>Loading agencies...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table className="agencies-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Approved</th>
              <th>UserID</th>
            </tr>
          </thead>
          <tbody>
            {agencies.map((agency) => (
              <tr key={agency.id}>
                <td>{agency.id}</td>
                <td>{agency.agencyName}</td>
                <td>{agency.agencyEmail}</td>
                <td>{agency.address}</td>
                <td>{agency.isApproved ? "Yes" : "No"}</td>
                <td>{agency.userID}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageAgencies;



// //new
// import React, { useEffect, useState } from "react";
// import './ManageAgencies.css';
// import Aganceman from './Aganceman.jpg';

// const ManageAgencies = () => {
//   const [agencies, setAgencies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [formError, setFormError] = useState("");
//   const [users, setUsers] = useState([]);

//   const [newAgency, setNewAgency] = useState({
//     userID: "",
//     agencyName: "",
//     agencyEmail: "",
//     address: ""
//   });

//   const storedToken = JSON.parse(localStorage.getItem("token"));

//   useEffect(() => {
//     if (!storedToken || !storedToken.tokenValue?.token) {
//       setError("Token is missing. Please log in again.");
//       setLoading(false);
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         // Fetch users first to populate dropdown
//         const usersResponse = await fetch("https://localhost:7050/api/User", {
//           headers: {
//             Authorization: `Bearer ${storedToken.tokenValue.token}`,
//           },
//         });

//         if (!usersResponse.ok) {
//           throw new Error("Failed to fetch users.");
//         }

//         const usersData = await usersResponse.json();
//         setUsers(usersData);

//         // Then fetch agencies
//         const agenciesResponse = await fetch("https://localhost:7050/api/Agency", {
//           headers: {
//             Authorization: `Bearer ${storedToken.tokenValue.token}`,
//           },
//         });

//         if (!agenciesResponse.ok) {
//           throw new Error("Failed to fetch agencies.");
//         }

//         const agenciesData = await agenciesResponse.json();
//         setAgencies(agenciesData);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

// const handleCreateAgency = async () => {
//   setFormError("");
  
//   // Validate inputs
//   if (!newAgency.userID || !newAgency.agencyName || !newAgency.agencyEmail || !newAgency.address) {
//     setFormError("Please fill in all fields.");
//     return;
//   }

//   try {
//     const payload = {
//       userID: parseInt(newAgency.userID),
//       agencyName: newAgency.agencyName,
//       agencyEmail: newAgency.agencyEmail,
//       address: newAgency.address
//     };

//     console.log("Creating agency with payload:", payload);

//     const response = await fetch("https://localhost:7050/api/Agency", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${storedToken.tokenValue.token}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     const responseData = await response.json().catch(() => ({}));

//     if (!response.ok) {
//       // Handle different error types
//       let errorMessage = "Failed to create agency";
      
//       if (response.status === 400) {
//         // Bad request errors
//         errorMessage = responseData.message || "Invalid request data";
        
//         if (responseData.AvailableUsers) {
//           errorMessage += `. Available users: ${JSON.stringify(responseData.AvailableUsers)}`;
//         }
//       } else if (response.status === 500) {
//         // Server errors
//         errorMessage = responseData.Details 
//           ? `Database error: ${responseData.Details}`
//           : "Server error occurred";
//       }
      
//       throw new Error(errorMessage);
//     }

//     // Success case
//     setAgencies([...agencies, responseData]);
//     setNewAgency({
//       userID: "",
//       agencyName: "",
//       agencyEmail: "",
//       address: ""
//     });
    
//     setFormError(""); // Clear any previous errors
    
//   } catch (err) {
//     console.error("Agency creation error:", err);
    
//     // User-friendly error messages
//     let displayError = err.message;
    
//     if (err.message.includes("foreign key")) {
//       displayError = "The selected user doesn't exist. Please choose a valid user.";
//     } else if (err.message.includes("unique constraint")) {
//       displayError = "This user already has an agency associated with them.";
//     } else if (err.message.includes("null constraint")) {
//       displayError = "Required information is missing. Please fill all fields.";
//     }
    
//     setFormError(displayError);
//   }
// };

//   return (
//     <div className="manage-agencies-container" style={{ backgroundImage: `url(${Aganceman})` }}>
//       <h2 style={{ color: "white" }}>Manage Agencies</h2>

//       <div className="create-agency-form">
//         <h3 style={{ color: "white" }}>Create New Agency</h3>
//         {formError && <p className="error-message">{formError}</p>}

//         <select
//           value={newAgency.userID}
//           onChange={(e) => setNewAgency({ ...newAgency, userID: e.target.value })}
//         >
//           <option value="">Select User</option>
//           {users.map(user => (
//             <option key={user.id} value={user.id}>
//               {user.userName} ({user.email})
//             </option>
//           ))}
//         </select>

//         <input
//           type="text"
//           placeholder="Agency Name"
//           value={newAgency.agencyName}
//           onChange={(e) => setNewAgency({ ...newAgency, agencyName: e.target.value })}
//         />
//         <input
//           type="email"
//           placeholder="Agency Email"
//           value={newAgency.agencyEmail}
//           onChange={(e) => setNewAgency({ ...newAgency, agencyEmail: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Agency Address"
//           value={newAgency.address}
//           onChange={(e) => setNewAgency({ ...newAgency, address: e.target.value })}
//         />
//         <button onClick={handleCreateAgency}>Create Agency</button>
//       </div>

//       {loading ? (
//         <p>Loading agencies...</p>
//       ) : error ? (
//         <p className="error-message">{error}</p>
//       ) : (
//         <table className="agencies-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Address</th>
//               <th>Approved</th>
//               <th>User ID</th>
//             </tr>
//           </thead>
//           <tbody>
//             {agencies.map((agency) => (
//               <tr key={agency.id}>
//                 <td>{agency.id}</td>
//                 <td>{agency.agencyName}</td>
//                 <td>{agency.agencyEmail}</td>
//                 <td>{agency.address}</td>
//                 <td>{agency.isApproved ? "Yes" : "No"}</td>
//                 <td>{agency.userID}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default ManageAgencies;




