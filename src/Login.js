// import { useState } from "react";
// import { Link, useNavigate } from 'react-router-dom';
// import tour from './tour.jpeg';
// import Orangeback from './Orangeback.jpg';
// import "./Login.css";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate(); // لإجراء التوجيه بعد تسجيل الدخول

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError(""); // Reset error before attempting login

//     try {
//       const response = await fetch("https://your-api-endpoint.com/login", {  // API endpoint for login
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ email, password })
//       });

//       const data = await response.json();
//       if (response.ok) {
//         console.log("Login successful", data);

//         // تخزين الـ role في localStorage بعد تسجيل الدخول بنجاح
//         localStorage.setItem("userRole", data.role);  // assuming the response contains a `role`

//         // بناءً على الـ role، توجيه المستخدم للصفحة المناسبة
//         if (data.role === 'admin') {
//           navigate('/admin');
//         } else if (data.role === 'travel-agency') {
//           navigate('/travel-agency');
//         } else if (data.role === 'tourist') {
//           navigate('/tourist');
//         }
//       } else {
//         setError(data.message || "Login failed");
//       }
//     } catch (err) {
//       setError("Network error, please try again");
//     }
//   };

//   return (
//     <div className="login-containerr" style={{ backgroundImage: `url(${Orangeback})` }}>
//       <div className="login-boxx">
//         <h2 className="login-titlee">Welcome to BooknGo</h2>
//         {error && <p className="error-message">{error}</p>}
//         <form onSubmit={handleLogin} className="loginform">
//           <div className="input-groupL">
//             <label>E-MAIL</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="input-groupL">
//             <label>PASSWORD</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" className="login-buttonn">Login</button>
//         </form>
//         <div className="forgot-password">
//           <a href="#">FORGET YOUR PASSWORD?</a>
//         </div>
//         {/* Link to create a new account */}
//         <div className="forgot-password">
//           <Link to="/new-account" style={{ textDecoration: 'underline' }}>
//             Don't have an account? Create a new account
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import Orangeback from './Orangeback.jpg';
import "./Login.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("https://localhost:7050/api/Authentication/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please check your credentials.");
      }

      if (!data.token || !data.user || !data.user.role) {
        throw new Error("Invalid server response structure");
      }

      // Save user data
      const token = { tokenValue: data.token };  // هذا هو الكائن الذي يحتوي على التوكن
      localStorage.setItem("token", JSON.stringify(token)); // تخزين التوكن كـ JSON string
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userEmail", data.user.email);

      onLogin({ 
        id: data.user.id,
        email: data.user.email,
        role: data.user.role
      });

      // Navigation based on role
      const rolePath = {
        'admin': '/admin/dashboard',
        'tourist': '/tourist',
        'travelagency': '/travel-agency'
      };

      navigate(rolePath[data.user.role.toLowerCase()] || '/');

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-containerr" style={{ backgroundImage: `url(${Orangeback})` }}>
      <div className="login-boxx">
        <h2 className="login-titlee">Welcome to BooknGo</h2>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="loginform">
          <div className="input-groupL">
            <label>E-MAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="input-groupL">
            <label>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className="login-buttonn"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="forgot-password">
          <Link to="/reset-password">FORGET YOUR PASSWORD?</Link>
        </div>
        <div className="forgot-password">
          <Link to="/new-account" style={{ textDecoration: 'underline' }}>
            Don't have an account? Create a new account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

// import { useState } from "react";
// import { useNavigate, Link } from 'react-router-dom';
// import Orangeback from './Orangeback.jpg';
// import "./Login.css";
// const Login = ({ onLogin }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     try {
//       const response = await fetch("http://localhost:7050/api/authentication/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: email,
//           password: password
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Login failed. Please check your credentials.");
//       }

//       if (!data.token || !data.user || !data.user.role) {
//         throw new Error("Invalid server response structure");
//       }

//       // Save user data
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("userId", data.user.id);
//       localStorage.setItem("userRole", data.user.role);
//       localStorage.setItem("userEmail", data.user.email);

//       onLogin({ 
//         id: data.user.id,
//         email: data.user.email,
//         role: data.user.role
//       });

//       // Navigation based on role
//       const rolePath = {
//         'admin': '/admin/dashboard',
//         'tourist': '/tourist/dashboard',
//         'travelagency': '/agency/dashboard'
//       };

//       navigate(rolePath[data.user.role.toLowerCase()] || '/');

//     } catch (err) {
//       console.error("Login error:", err);
//       setError(err.message || "An unexpected error occurred. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="login-containerr" style={{ backgroundImage: `url(${Orangeback})` }}>
//       <div className="login-boxx">
//         <h2 className="login-titlee">Welcome to BooknGo</h2>
        
//         {error && (
//           <div className="error-message">
//             <p>{error}</p>
//           </div>
//         )}

//         <form onSubmit={handleLogin} className="loginform">
//           <div className="input-groupL">
//             <label>E-MAIL</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               disabled={isLoading}
//             />
//           </div>
//           <div className="input-groupL">
//             <label>PASSWORD</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               disabled={isLoading}
//             />
//           </div>
//           <button 
//             type="submit" 
//             className="login-buttonn"
//             disabled={isLoading}
//           >
//             {isLoading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <div className="forgot-password">
//           <Link to="/reset-password">FORGET YOUR PASSWORD?</Link>
//         </div>
//         <div className="forgot-password">
//           <Link to="/new-account" style={{ textDecoration: 'underline' }}>
//             Don't have an account? Create a new account
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// بختبر ربط الكود بثوابت ده مش صح طبعا

// import { useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import Orangeback from './Orangeback.jpg';
// import "./Login.css";

// const Login = ({ onLogin }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const response = await fetch("https://your-api-endpoint.com/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!response.ok) {
//         throw new Error("Invalid username or password");
//       }

//       const data = await response.json();
//       const { role, token } = data;

//       localStorage.setItem("token", token);
//       localStorage.setItem("userRole", role);

//       onLogin({ role });

//       if (role === 'Admin') {
//         navigate('/admin');
//       } else if (role === 'TravelAgency') {
//         navigate('/travel-agency');
//       } else if (role === 'Tourist') {
//         navigate('/tourist');
//       }
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   return (
//     <div className="login-containerr" style={{ backgroundImage: `url(${Orangeback})` }}>
//       <div className="login-boxx">
//         <h2 className="login-titlee">Welcome to BooknGo</h2>
//         {error && <p className="error-message">{error}</p>}
//         <form onSubmit={handleLogin} className="loginform">
//           <div className="input-groupL">
//             <label>E-MAIL</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="input-groupL">
//             <label>PASSWORD</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" className="login-buttonn">Login</button>
//         </form>
//         <div className="forgot-password">
//           <a href="/reset-password">FORGET YOUR PASSWORD?</a>
//         </div>
//         <div className="forgot-password">
//           <a href="/new-account" style={{ textDecoration: 'underline' }}>
//             Don't have an account? Create a new account
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// the real one
// import { useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import Orangeback from './Orangeback.jpg';
// import "./Login.css";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError(""); // Reset error before attempting login

//     // إرسال البيانات إلى الـ API للتحقق
//     try {
//       const response = await fetch("https://your-api-endpoint.com/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!response.ok) {
//         throw new Error("Invalid username or password");
//       }

//       const data = await response.json();

//       // استخراج الـ Role من الاستجابة
//       const { role, token } = data;

//       // تخزين التوكن في الـ LocalStorage
//       localStorage.setItem("authToken", token);

//       // توجيه المستخدم بناءً على الـ role
//       if (role === 'admin') {
//         navigate('/admin');
//       } else if (role === 'travel-agency') {
//         navigate('/travel-agency');
//       } else if (role === 'tourist') {
//         navigate('/tourist');
//       }
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   return (
//     <div className="login-containerr" style={{ backgroundImage: `url(${Orangeback})` }}>
//       <div className="login-boxx">
//         <h2 className="login-titlee">Welcome to BooknGo</h2>
//         {error && <p className="error-message">{error}</p>}
//         <form onSubmit={handleLogin} className="loginform">
//           <div className="input-groupL">
//             <label>E-MAIL</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="input-groupL">
//             <label>PASSWORD</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" className="login-buttonn">Login</button>
//         </form>
//         <div className="forgot-password">
//           <a href="#">FORGET YOUR PASSWORD?</a>
//         </div>
//         <div className="forgot-password">
//           <a href="/new-account" style={{ textDecoration: 'underline' }}>
//             Don't have an account? Create a new account
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
