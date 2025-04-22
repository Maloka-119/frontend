import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css"
import restpassbackgr from './restpassbackgr.jpg'

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleReset = (e) => {
    e.preventDefault();
    setMessage("");

    if (!validatePassword(newPassword)) {
      setSuccess(false);
      setMessage("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSuccess(false);
      setMessage("Passwords do not match");
      return;
    }

    // مكان API call
    // sendResetRequest(email, newPassword);

    setSuccess(true);
    setMessage("Password has been reset");

    setTimeout(() => {
      navigate("/login"); // لو عندك صفحة login
    }, 2000);
  };

  return (
    <div className="login-containerr" style={{ backgroundImage: `url(${restpassbackgr})` }}>
      <div className="login-boxx">
        <h2 className="login-titlee">Reset Your Password</h2>

        {message && (
          <p className={success ? "success-message" : "error-message"}>
            {message}
          </p>
        )}

        <form onSubmit={handleReset} className="loginform">
          <div className="input-groupL">
            <label>your E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-groupL">
            <label>New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="input-groupL">
            <label>Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-buttonn">
            Save New Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

