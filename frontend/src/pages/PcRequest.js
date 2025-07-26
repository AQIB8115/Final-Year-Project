
import React, { useEffect, useState } from 'react';

const PcRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch all PC requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/requests', {
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch requests');
      }
      const data = await response.json();
      console.log('Fetched requests:', data.requests); 
      setRequests(data.requests);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update request status
  const updateStatus = async (requestId, status) => {
    try {
      const response = await fetch('http://localhost:5000/api/status', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }

      // After status update, remove the request from the UI
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== requestId)
      );

      alert(`Request ${status} successfully!`);

    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Loading requests...</p>;
  if (errorMessage) return <p style={{ textAlign: 'center', color: 'red' }}>Error: {errorMessage}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>PC Reservation Requests</h2>
      {requests.length === 0 ? (
        <p style={styles.noRequests}>No reservation requests found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User ID</th>
              <th style={styles.th}>PC Number</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} style={styles.tr}>
                <td style={styles.td}>{req.user ? `${req.user.studentID}` : 'Unknown User'}</td>
                <td style={styles.td}>{req.pc ? req.pc.pc_Number : 'Unknown'}</td>
                <td style={styles.td}>{req.status || 'Pending'}</td>
                <td style={styles.td}>
                  <button 
                    style={styles.approveButton} 
                    onClick={() => updateStatus(req._id, 'Approved')}
                  >
                    Approve
                  </button>
                  <button 
                    style={styles.rejectButton} 
                    onClick={() => updateStatus(req._id, 'Rejected')}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  
  container: {
    maxWidth: '90%',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    // backgroundImage: 'url("/images/home1.5.jpg")', // Replace with your image URL
    backgroundSize: 'cover',  // Ensures the image covers the entire container
    backgroundPosition: 'center',  // Centers the image
    backgroundRepeat: 'no-repeat'
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333',
  },
  noRequests: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#666',
  },
  table: {
    width: '100vh',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  th: {
    // backgroundColor: 'darkgreen',
    padding: '10px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
  },
  tr: {
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '10px',
    textAlign: 'left',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  rejectButton: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default PcRequests;
