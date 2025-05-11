import './LoadingSpinner.css'; // يمكنك إنشاء ملف CSS له إذا لزم الأمر

const LoadingSpinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;