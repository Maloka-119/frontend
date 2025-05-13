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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: email,
        password: password 
      }),
    });

    // قراءة الاستجابة كنص أولاً
    const responseText = await response.text();
    let data = {};

    try {
      // محاولة تحليل النص كـ JSON فقط إذا كان غير فارغ
      data = responseText ? JSON.parse(responseText) : {};
    } catch (jsonError) {
      console.error("Failed to parse JSON:", jsonError);
      // إذا فشل التحليل ولكن الاستجابة ناجحة (200-299)
      if (response.ok) {
        // ربما الخادم يرجع رسالة نصية بسيطة
        data = { message: responseText };
      } else {
        throw new Error(responseText || "Login failed");
      }
    }

    if (!response.ok) {
      // معالجة رسائل الخطأ المختلفة
      let errorMsg = "Invalid email or password";
      
      if (typeof data === 'object' && data !== null) {
        errorMsg = data.message || 
                  (data.errors ? Object.values(data.errors).join(' ') : 
                  "Invalid credentials");
      } else if (typeof data === 'string') {
        errorMsg = data;
      }

      throw new Error(errorMsg);
    }

    // التحقق من وجود الحقول الأساسية في الاستجابة
    if (!data.token || !data.userName || !data.roles) {
      console.warn("Server response:", data);
      throw new Error("Server response is missing required fields");
    }

    // التأكد من أن الأدوار هي مصفوفة
    const rolesArray = Array.isArray(data.roles) ? data.roles : [data.roles];

    // حفظ بيانات المستخدم
    localStorage.setItem("token", data.token);
    localStorage.setItem("userName", data.userName);
    localStorage.setItem("userRoles", JSON.stringify(rolesArray));
    localStorage.setItem("userEmail", email);

    // تحديث حالة التطبيق
    onLogin({
      userName: data.userName,
      email: email,
      role: rolesArray[0]
    });

    // تعيين مسارات الأدوار مع تحسين التوافق
    const roleMap = {
      admin: "/admin",
      tourist: "/tourist",
      travelagency: "/travel-agency",
      travel_agency: "/travel-agency",
      "travel agency": "/travel-agency"
    };
    
    const primaryRole = rolesArray[0].toLowerCase().replace(/\s+/g, '_');
    navigate(roleMap[primaryRole] || "/");

  } catch (err) {
    console.error("Login error:", err);
    setError(err.message || "Login failed. Please try again.");
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



//last correct
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
//       const response = await fetch("https://localhost:7050/api/Authentication/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           email: email,
//           password: password 
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         // معالجة رسائل الخطأ المختلفة
//         const errorMsg = data.message || 
//                         (typeof data === 'string' ? data : "Invalid email or password");
//         throw new Error(errorMsg);
//       }

//       // التحقق من وجود الحقول الأساسية في الاستجابة
//       if (!data.token || !data.userName || !data.roles) {
//         throw new Error("Invalid server response structure");
//       }

//       // حفظ بيانات المستخدم في localStorage
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("userName", data.userName);
//       localStorage.setItem("userRoles", JSON.stringify(data.roles));
//       localStorage.setItem("userEmail", email);

//       // تحديث حالة التطبيق
//       onLogin({
//         userName: data.userName,
//         email: email,
//         role: data.roles[0] // نأخذ أول دور من المصفوفة
//       });

//       // التوجيه حسب الدور الرئيسي
//       const roleMap = {
//         admin: "/admin/*",
//         tourist: "/tourist",
//         travelagency: "/travel-agency"
//       };
      
//       const primaryRole = data.roles[0].toLowerCase();
//       navigate(roleMap[primaryRole] || "/");

//     } catch (err) {
//       console.error("Login error:", err);
//       setError(err.message || "An unexpected error occurred during login");
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


