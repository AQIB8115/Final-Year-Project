
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

const Profile = () => {
  const [user, setUser] = useState(null);  // State to hold user data
  const [error, setError] = useState(null); // State for error messages
  const navigate = useNavigate();  // Use useNavigate for programmatic navigation

  // Fetch user profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch the profile data from the backend
        const response = await fetch('https://final-year-project-api-ten.vercel.app/api/profile', {
          method: 'GET',
          credentials: 'include',  // Include cookies (session) with the request
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json(); // Parse the JSON response
        setUser(data);  // Set the user data to state
      } catch (err) {
        setError(err.message);  // Handle errors
      }
    };

    fetchProfile();
  }, []); // Empty dependency array to run once when the component mounts

  // Logout function
  const handleLogout = () => {
    // Implement logout functionality (e.g., clear session, redirect to login)
    fetch('https://final-year-project-api-ten.vercel.app/api/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(() => {
      navigate('/api/login');  // Use navigate instead of history.push
    }).catch((err) => {
      console.error('Error logging out:', err);
    });
  };

  return (
    <div style={styles.container}>
      <h2>Profile</h2>
      
      {error && <div style={styles.error}>{error}</div>}  {/* Display error if any */}
      
      {user ? (
        <div style={styles.profileInfo}>
          <p><strong>Username:</strong> {user.username}</p>
          
          {/* Display email only for faculty and librarian */}
          {(user.role === 'faculty' || user.role === 'librarian') && (
            <p><strong>Email:</strong> {user.email}</p>
          )}
          
          <p><strong>Role:</strong> {user.role}</p>
          
          {/* Conditionally display details based on role */}
          {user.role === 'student' && (
            <>
              <p><strong>Department:</strong> {user.department}</p>
              <p><strong>Student ID:</strong> {user.studentID}</p>
            </>
          )}
          
          {(user.role === 'faculty' || user.role === 'librarian') && (
            <p><strong>Employee ID:</strong> {user.employeeId}</p>
          )}
          
          {/* Logout button */}
          <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading profile...</p> // Display a loading message while fetching data
      )}
    </div>
  );
};

// Basic styles for the profile page
const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
    fontFamily: "'Arial', sans-serif",
  },
  error: {
    color: 'red',
    marginBottom: '20px',
  },
  profileInfo: {
    marginTop: '20px',
    textAlign: 'left',
    fontSize: '18px',
    backgroundColor: 'lightgreen',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  logoutButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background-color 0.3s ease',
  },
  logoutButtonHover: {
    backgroundColor: '#0056b3',
  },
  '@media (max-width: 768px)': {
    container: {
      padding: '15px',
    },
    profileInfo: {
      padding: '15px',
    },
    logoutButton: {
      width: '100%',
    },
  },
};

export default Profile;
