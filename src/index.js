import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // ✅ أضف هذا
import './index.css';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ لفّ التطبيق هنا */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
