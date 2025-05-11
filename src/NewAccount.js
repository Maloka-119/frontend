
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
    role: "Tourist" // Default role
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

    // Password confirmation check
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Prepare data for API
    const userData = {
      UserName: formData.userName,
      Email: formData.email,
      Password: formData.password,
      PhoneNumber: formData.phoneNumber,
      Role: formData.role
    };

    try {
      const response = await fetch("https://localhost:7050/api/Authentication/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "An error occurred during registration");
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
          {/* User Type */}
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

          {/* Username */}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
              minLength="3"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

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


//test

// import React, { useState } from "react";
// import './NewAccount.css';
// import Blueback from './Blueback.jpg';
// import { useNavigate } from "react-router-dom";  // استيراد useNavigate

// const NewAccount = () => {
//   const navigate = useNavigate();  // تهيئة navigate
//   const [userType, setUserType] = useState("tourist");  // إزالة admin من الـ default
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [agencyName, setAgencyName] = useState("");
//   const [agencyDescription, setAgencyDescription] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     // تحقق من تطابق كلمة المرور مع تأكيد كلمة المرور
//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     // تحضير بيانات المستخدم
//     const userData = {
//       username,
//       email,
//       password,
//       userType,
//       agencyName: userType === "agency" ? agencyName : null,
//       agencyDescription: userType === "agency" ? agencyDescription : null,
//     };

//     try {
//       const response = await fetch("YOUR_BACKEND_API_URL", { // استبدل بـ URL ال API الصحيح
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccess("Account successfully created!");
//         console.log("Registration successful", data);
//         // بعد إنشاء الحساب بنجاح، يتم توجيه المستخدم إلى صفحة الـ login
//         navigate("/login");  // هنا تقوم بالتوجيه إلى صفحة الـ login
//       } else {
//         setError(data.message || "Account creation failed");
//       }
//     } catch (err) {
//       setError("Network error, please try again.");
//     }
//   };

//   return (
//     <div className="register-container" style={{ backgroundImage: `url(${Blueback})` }}>
//       <div className="register-box" >
//         <h2 className="register-title">Create Account</h2>
//         {error && <p className="error-message">{error}</p>}
//         {success && <p className="success-message">{success}</p>}
//         <form onSubmit={handleRegister} >
//           {/* User Type */}
//           <div className="input-group"  >
//             <label>User Type</label>
//             <select
//               value={userType}
//               onChange={(e) => setUserType(e.target.value)}
//               required
//             >
//               <option value="tourist">Tourist</option>
//               <option value="agency">Travel Agency</option>
//             </select>
//           </div>

//           {/* Username */}
//           <div className="input-group">
//             <label>Username</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//           </div>

//           {/* Email */}
//           <div className="input-group">
//             <label>Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           {/* Password */}
//           <div className="input-group">
//             <label>Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           {/* Confirm Password */}
//           <div className="input-group">
//             <label>Confirm Password</label>
//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//           </div>

//           {/* Travel Agency Fields */}
//           {userType === "agency" && (
//             <>
//               <div className="input-group">
//                 <label>Agency Name</label>
//                 <input
//                   type="text"
//                   value={agencyName}
//                   onChange={(e) => setAgencyName(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="input-group">
//                 <label>Agency Description</label>
//                 <textarea
//                   value={agencyDescription}
//                   onChange={(e) => setAgencyDescription(e.target.value)}
//                   required
//                 />
//               </div>
//             </>
//           )}

//           <button type="submit" className="register-button">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default NewAccount;
