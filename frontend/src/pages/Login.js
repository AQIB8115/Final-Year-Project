
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    id: '', // Student ID or Employee ID
    password: '',
  });
  const [loading, setLoading] = useState(false); // Loading state for better UX 
  const navigate = useNavigate();
  const location = useLocation();
  const { bookId, type } = location.state || {}; // Extract book details from location.state
  const { pcId, startTime, endTime } = location.state || {};
  console.log('Reservation details from location.state:', pcId, startTime, endTime);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, password } = formData;

    if (!id || !password) {
      alert("Please fill in all the fields.");
      return;
    }

    setLoading(true);

    try {
      let dataToSend = { password };

      // Determine if input is studentID or employeeId
      if (/^\d+$/.test(id)) {
        dataToSend = { studentID: id.trim(), password };
      } else {
        dataToSend = { employeeId: id.trim(), password };
      }

      const response = await fetch('https://final-year-project-api-ten.vercel.app/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      const { _id, role } = data.user;  // Get the role from the response

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', _id); // Save userId as well
      localStorage.setItem('isLoggedIn', 'true');

      if (location.state?.pdfUrl) {
        // PDF ka URL mil gaya, toh login ke baad direct wapas usi page par
        navigate('/viewpdf', { state: { pdfUrl: location.state.pdfUrl } });
        return;  // Aage koi aur redirect logic mat chalao
    }

      if (bookId && type) {
        await handleBookRequest(bookId, type);
      }

       // Handle reservation request if pcId is provided (this means a reservation was attempted)
       if (pcId && startTime && endTime) {
        console.log('Reservation details:', pcId, startTime, endTime);
        await handleReservationRequest(pcId, startTime, endTime);
      }

      // Navigate based on user role
      if (role === 'librarian') {
        navigate('/admin-dashboard', { state: { userId: _id } }); // Navigate to admin dashboard for librarian
      } else {
        navigate('/student-dashboard', { state: { userId: _id } }); // Default to student dashboard
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleReservationRequest = async (pcId, startTime, endTime) => {
    console.log('Creating reservation request for PC:', pcId, 'Start Time:', startTime, 'End Time:', endTime);
    try {
      const reservationDetails = {
        userId: localStorage.getItem('userId'),
        pcNumber: pcId,
        startTime,
        endTime,
      };

      const response = await fetch('https://final-year-project-api-ten.vercel.app/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(reservationDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create reservation request');
      }

      alert('Reservation request submitted successfully!');
    } catch (error) {
      console.error("Error creating reservation request:", error);
      alert("An error occurred while creating the reservation request.");
    }
  };

  const handleBookRequest = async (bookId, type) => {
    try {
      const requestResponse = await fetch('https://final-year-project-api-ten.vercel.app/api/requests/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bookId, type }),
      });

      if (!requestResponse.ok) {
        const errorData = await requestResponse.json();
        throw new Error(errorData.message || `Failed to submit ${type} request`);
      }

      alert(`Book ${type} request submitted successfully!`);
    } catch (error) {
      console.error("Error creating book request:", error);
      alert("An error occurred while creating the book request.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="id"
              placeholder="Username or ID"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="signup-link">
          Don't have an account? <Link to="/api/signup">Sign up</Link>
        </p>
      </div>
      <style jsx>{`
      html, body {
  width:100vw;
  height: 100vh;
  mergin : 0;
  padding : 0;
  overflow: hidden;
  

  font-family: 'Arial', sans-serif;
}

        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 250vh;
          background: linear-gradient(to right,rgb(5, 51, 16),rgb(5, 54, 30));
          background-image: url('/images/home1.3.jpg');  /* Path relative to the public folder */
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          padding: 20px;
        }

        .login-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgb(244, 248, 245);
          padding: 20px;
          width: 100%;
          max-width: 400px;
        }

        h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          color: black;
        }

        input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        .login-button {
          width: 100%;
          padding: 10px;
          background-color:rgb(7, 71, 17);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .login-button:disabled {
          background-color: #999;
          cursor: not-allowed;
        }

        .signup-link {
          text-align: center;
          margin-top: 10px;
        }

        .signup-link a {
          color: #0072ff;
          text-decoration: none;
        }

        .signup-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Login;
