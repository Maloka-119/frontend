import { Link } from 'react-router-dom';
import './Unauthorized.css'; // يمكنك إنشاء ملف CSS له إذا لزم الأمر

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h1>403 - Unauthorized Access</h1>
      <p>You don't have permission to access this page.</p>
      <div className="unauthorized-actions">
        <Link to="/" className="home-link">Go to Home</Link>
        <Link to="/login" className="login-link">Try another account</Link>
      </div>
    </div>
  );
};

export default Unauthorized;