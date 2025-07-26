

import React, { useState, useEffect } from 'react';

const LibrarianRequest = () => {
    const [requests, setRequests] = useState([]);
    const [message, setMessage] = useState('');

    const fetchRequests = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/requests/pending', {
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                setRequests(data.requests);
            } else {
                setMessage(data.message || 'Failed to fetch requests');
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            setMessage('Error fetching requests');
        }
    };

    const handleReview = async (requestId, action) => {
        try {
            const response = await fetch('http://localhost:5000/api/requests/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ requestId, action }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Request ${action}d successfully!`);
                fetchRequests(); // Refresh requests list
            } else {
                setMessage(data.message || 'Failed to process request');
            }
        } catch (error) {
            console.error('Error processing request:', error);
            setMessage('Error processing request');
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div className="container">
            <h2>Pending Requests</h2>
            {message && <p className="message">{message}</p>}
            <table className="responsive-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Book</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.length > 0 ? (
                        requests.map((request) => (
                            <tr key={request._id}>
                                <td>{request.user.username} ({request.user.email})</td>
                                <td>{request.book.Title} by {request.book.Author}</td>
                                <td>{request.type}</td>
                                <td>{request.status}</td>
                                <td>
                                    <button className="approve" onClick={() => handleReview(request._id, 'approve')}>Approve</button>
                                    <button className="decline" onClick={() => handleReview(request._id, 'decline')}>Decline</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No pending requests</td>
                        </tr>
                    )}
                </tbody>

            </table>

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
                    min-width : 150vh;
                    font-family: Arial, sans-serif;
                    background:rgb(148, 190, 152);
                }

                h2 {
                    margin-bottom: 20px;
                    color: black;
                    text-align: center;
                }

                .message {
                    margin-bottom: 20px;
                    padding: 10px;
                    border-radius: 5px;
                    color: #fff;
                    {/* background-color: #007bff; */}
                }

                .responsive-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }

                .responsive-table th, .responsive-table td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                }

                .responsive-table th {
                    {/* background-color: #007bff; */}
                    color: black;
                }

                .responsive-table tr:nth-child(even) {
                    {/* background-color: #f2f2f2; */}
                }

                .responsive-table tr:hover {
                    background-color: #e2e2e2;
                }

                button {
                    padding: 8px 12px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                }

                .approve {
                    background-color: #28a745;
                    color: black;
                }

                .approve:hover {
                    background-color: #218838;
                }

                .decline {
                    background-color: #dc3545;
                    color: black;
                    margin-left: 10px;
                }

                .decline:hover {
                    background-color: #c82333;
                }

                @media (max-width: 768px) {
                    .responsive-table {
                        font-size: 12px;
                    }

                    button {
                        padding: 6px 10px;
                        font-size: 12px;
                    }
                }
            `}</style>
        </div>
    );
};

export default LibrarianRequest;
