import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Call the backend API to logout
      const response = await fetch('https://final-year-project-api-ten.vercel.app/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include session cookies with the request
      });

      if (!response.ok) {
        throw new Error('Failed to log out');
      }

      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      // Redirect to the login page after successful logout
      navigate('/api/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Logout</h2>
      {error && <div className="error">{error}</div>}  {/* Display error if any */}
      <button onClick={handleLogout} className="logoutBtn">
        Logout
      </button>
      <style jsx>{`
        html, body {
          width:100vw;
          height: 100vh;
          mergin : 0;
          padding : 0;
          overflow: hidden;
          background: linear-gradient(to right, #f0f8ff, #d9eaf7); /* Smooth background gradient */
          background-image: url('/images/home1.13.jpg');  /* Path relative to the public folder */
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          font-family: 'Arial', sans-serif;
        }
        .container {
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          background-color: white;
        }
        .error {
          color: red;
          margin-bottom: 20px;
        }
        .logoutBtn {
          padding: 10px 20px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .logoutBtn:hover {
          background-color: #d32f2f;
        }
      `}</style>
    </div>
  );
};

export default Logout;
