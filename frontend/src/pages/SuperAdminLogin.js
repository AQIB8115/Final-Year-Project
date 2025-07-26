
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// const SuperAdminLogin = ({ setIsAuthenticated }) => {
const SuperAdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    

    if (username.trim() === '' || password.trim() === '') {
      setError('Username and password are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/login-superadmin', {
        method: 'POST',
        // withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.status === 200) {
        localStorage.setItem('token', data.user.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Login successful! You are logged in as SuperAdmin.');
        // setIsAuthenticated(true);
        navigate('/admin-dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again later.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>SuperAdmin Login</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
};

// Internal CSS styles
const styles = {
  container: {
    maxWidth: '400px',
    margin: '100px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  heading: {
    marginBottom: '20px',
    color: '#333',
    fontSize: '24px',
  },
  error: {
    color: 'red',
    marginBottom: '15px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: '15px',
    width: '100%',
  },
  label: {
    marginBottom: '5px',
    display: 'block',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
  },
};

export default SuperAdminLogin;
  