

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { socket } from '../socket'; // Import the WebSocket instance

const StudentDashboard = () => {
    const [showProfile, setShowProfile] = useState(false); // State to toggle profile visibility
    const [profileData, setProfileData] = useState(null); // Store profile data
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // To navigate to the Logout page

    // Toggle profile visibility
    const toggleProfile = async () => {
        if (!profileData) {
            // Fetch the profile data if not already fetched
            fetchProfile();
        } else {
            setShowProfile(!showProfile); // Toggle profile visibility
        }
    };

    const closeProfile = () => {
        setShowProfile(false); // Close the profile box when cross is clicked
    };

    useEffect(() => {
        const userId = 1;  // Replace with actual userId fetching logic

        // Listen for user-specific notifications
        socket.on('userNotification', (data) => {
            if (data.userId === userId) {
                alert(`Notification: ${data.message}`);
            }
        });

        return () => {
            socket.off('userNotification');
        };
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('https://final-year-project-api-ten.vercel.app/api/profile', {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const data = await response.json();
            setProfileData(data);  // Set the profile data to state
            setShowProfile(true);   // Show the profile information
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        // Redirect to the logout page
        navigate('/logout');
    };

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-header">
                <div className="header-title">User Panel</div>
                <div className="header-nav">
                    {/* <Link to="/book-details">Book List</Link> */}
                    <Link to="/getUserViewPcs">All PCs</Link>
                    <Link to="/books">New Borrow</Link>
                    <Link to="/viewpdf">Soft-form Books</Link>
                    <Link to="/notifications">Notifications</Link>
                    <button onClick={toggleProfile} className="profile-btn">Profile</button>
                </div>
                {/* Display the username in the header if profile data is available */}
                {profileData && <div className="header-username"> {profileData.username}</div>}
            </div>

            {/* Profile information slide below */}
            {showProfile && profileData && (
                <div className="profile-slide">
                    <button onClick={closeProfile} className="close-btn">X</button>
                    <div style={profileStyles.profileBox}>
                        <h3>User</h3>
                        {error && <div style={profileStyles.error}>{error}</div>}
                        <p><strong>Username:</strong> {profileData.username}</p>
                        {(profileData.role === 'faculty' || profileData.role === 'librarian') && (
                            <p><strong>Email:</strong> {profileData.email}</p>
                        )}
                        <p><strong>Role:</strong> {profileData.role}</p>
                        {profileData.role === 'student' && (
                            <>
                                <p><strong>Department:</strong> {profileData.department}</p>
                                <p><strong>Student ID:</strong> {profileData.studentID}</p>
                            </>
                        )}
                        {(profileData.role === 'faculty' || profileData.role === 'librarian') && (
                            <p><strong>Employee ID:</strong> {profileData.employeeId}</p>
                        )}
                        <button onClick={handleLogout} style={profileStyles.logoutButton}>Logout</button>
                    </div>
                </div>
            )}

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
                .dashboard-wrapper {
                    display: flex;
                    flex-direction: column;
                    
                }

                .dashboard-header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    padding: 0px 40px;
                    background-color: green;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
                    z-index: 1000;
                    min-height: 100vh;
                     min-width: 212vh;
                    /* Ensure it fills the viewport height */
                    background: linear-gradient(to right, #f0f8ff, #d9eaf7);
                    background-image: url('/images/home1.jpeg');
                    
                }

                .header-title {
                    font-size: 3em;
                    background-color: darkgreen;
                    width : 260vh;
                    text-align : center;
                    margin-bottom: 0px;
                }

                .header-nav {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    background-color: darkgreen;
                    width : 260vh;
                    justify-content: center;
                    
                }

                .header-nav a, .header-nav button {
                    color: white;
                    text-decoration: none;
                    padding: 5px 8px;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                    font-size: 0.9em;
                    
                }

                .header-nav a:hover, .header-nav button:hover {
                    background-color:rgb(14, 153, 60);
                }

                .profile-btn {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background-color:rgb(24, 197, 33);
                    color: white;
                    font-size: 20px;
                    font-weight: bold;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    top: 0px;
                    right: 30px;
                    
                }

                .profile-btn:hover {
                    background-color:rgb(20, 104, 20);
                }

                .profile-slide {
                    position: fixed;
                    top: 80px; /* Adjusted to make it below the header */
                    right: 20px; /* To keep it close to the right side */
                    width: 300px;
                    background-color: lightgreen;
                    box-shadow: -4px 0 8px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    z-index: 1001;
                }

                .close-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: green;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: black; /* Cross icon color set to black */
                }

                .profileBox {
                    margin-top: 20px;
                }

                .logoutButton {
                    margin-top: 20px;
                    padding: 10px;
                    background-color:rgb(216, 67, 8);
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }

                .logoutButton:hover {
                    background-color:rgb(145, 14, 21);
                }

                .header-username {
                    font-size: 1em;
                    margin-top: 60px;
                    color: white;
                    font-weight: bold;
                    position: absolute;
                    right:10px;
                    {/* bottom: 10px; */}
                }
            `}</style>
        </div>
    );
};

// Inline styles for the profile section
const profileStyles = {
    profileInfo: {
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    error: {
        color: 'red',
        marginBottom: '20px',
    },
    profileBox: {
        marginTop: '20px',
    },
    logoutButton: {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default StudentDashboard;

