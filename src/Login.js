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

// بختبر ربط الكود بثوابت ده مش صح طبعا

import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Orangeback from './Orangeback.jpg';
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // لإجراء التوجيه بعد تسجيل الدخول

  const users = {
    admin: { email: 'admin@example.com', password: 'admin123' },
    'travel-agency': { email: 'agency@example.com', password: 'agency123' },
    tourist: { email: 'tourist@example.com', password: 'tourist123' },
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError(""); // Reset error before attempting login

    // التحقق من البيانات المدخلة
    const userRole = Object.keys(users).find(
      (role) => users[role].email === email && users[role].password === password
    );

    if (userRole) {
      // بناءً على الـ role، توجيه المستخدم للصفحة المناسبة
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'travel-agency') {
        navigate('/travel-agency');
      } else if (userRole === 'tourist') {
        navigate('/tourist');
      }
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-containerr" style={{ backgroundImage: `url(${Orangeback})` }}>
      <div className="login-boxx">
        <h2 className="login-titlee"> BooknGo</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin} className="loginform">
          <div className="input-groupL">
            <label>E-MAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-groupL">
            <label>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-buttonn">Login</button>
        </form>
        <div className="forgot-password">
          <a href="/reset_password">FORGET YOUR PASSWORD?</a>
        </div>
        {/* Link to create a new account */}
        <div className="forgot-password">
          <a href="/new-account" style={{ textDecoration: 'underline' }}>
            Don't have an account? Create a new account
          </a>
        </div>
      </div>
      {/* <a href="/" className="backto">
        <i >🔙</i>  
      </a> */}
    </div>
  );
};

export default Login;

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
