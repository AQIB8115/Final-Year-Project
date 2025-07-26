import React, { useEffect, useState } from 'react';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('https://final-year-project-api-ten.vercel.app/api/requests/pending', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setRequests(data.requests);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      const response = await fetch('https://final-year-project-api-ten.vercel.app/api/requests/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action }),
      });

      if (response.ok) {
        alert(`Request ${action}d successfully!`);
        setRequests(requests.filter((req) => req.id !== requestId)); // Remove processed request
      } else {
        alert('Failed to update request');
      }
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  return (
    <div>
      <h2>Pending Requests</h2>
      {requests.map((req) => (
        <div key={req.id}>
          <p>{req.book.Title} requested by {req.user.username}</p>
          <button onClick={() => handleAction(req.id, 'approve')}>Approve</button>
          <button onClick={() => handleAction(req.id, 'decline')}>Decline</button>
        </div>
      ))}
    </div>
  );
};

export default AdminRequests;
