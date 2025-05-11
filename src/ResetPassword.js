import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import restpassbackgr from './restpassbackgr.jpg';

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{5,}$/;
    return regex.test(password);
  };
  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (!validatePassword(newPassword)) {
      setSuccess(false);
      setMessage("Password must contain at least 5 characters, one uppercase letter, one number, and one special character.");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setSuccess(false);
      setMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://localhost:7050/api/User/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          newPassword,
          confirmPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      setSuccess(true);
      setMessage(data.message || "Password has been reset successfully");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setSuccess(false);
      setMessage(err.message || "An error occurred during password reset");
      console.error("Reset password error:", err);
    } finally {
      setIsLoading(false);
    }
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
            <label>Your E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="input-groupL">
            <label>New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="input-groupL">
            <label>Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="login-buttonn"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Save New Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
