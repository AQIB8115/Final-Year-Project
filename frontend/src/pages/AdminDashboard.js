
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { socket } from '../socket';

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('');
    const [subSection, setSubSection] = useState(null); // Track the clicked sub-section
    // const navigate = useNavigate();
    

    useEffect(() => {
        // Listen for new requests
        socket.on('newRequest', (data) => {
            alert(`New Request: ${data.message}`);
        });

        return () => {
            // Clean up the listener
            socket.off('newRequest');
        };
    }, []);

    return (
        <div className="dashboard-wrapper">
            {/* Compact fixed header */}
            <header className="dashboard-header">
                <div className="header-title">
                    <h1>Librarian Dashboard</h1>
                </div>
                <nav className="header-nav">
                    <Link onClick={() => setActiveSection('books')} to="#">Books</Link>
                    <Link onClick={() => setActiveSection('pcs')} to="#">PCs</Link>
                    <Link onClick={() => setActiveSection('users')} to="#">Account Details</Link>
                    
                    <Link to="/librarian/requests">Requests</Link>
                    {/* <Link to="/notification">PC Request</Link> */}
                    <Link to="/request">Pc Requests</Link>
                    <Link to="/borrow-book">Borrow Records</Link>
                    <Link to="/profile">Profile</Link>
                    {/* <button onClick={() => navigate(-1)} className="back-button">Back</button> */}
                </nav>
            </header>

            {/* Main Content */}
            <div className="dashboard-container">
                {activeSection === 'books' && (
                    <ul className="dashboard-menu">
                        <li><Link to="/admin/create-book">Create Book</Link></li>
                        <li><Link to="/uploadbook">Upload Book</Link></li>
                        <li><Link to="/admin/all-books">View All Books</Link></li>
                        <li><Link to="/spinelabel">Spine Label</Link></li>
                    </ul>
                )}

                {activeSection === 'pcs' && (
                    <ul className="dashboard-menu">
                        <li><Link to="/admin/create-pc">Create PC</Link></li>
                        <li><Link to="/admin/list-pc">List PC</Link></li>
                        {/* <li><Link to="/admin/update-pc/:id">Update PC</Link></li> */}
                        {/* <li><Link to="/admin/delete-pc/:id">Delete PC</Link></li> */}
                    </ul>
                )}

                {activeSection === 'users' && (
                    <ul className="dashboard-menu">
                        <li><Link to="/admin/user">User List</Link></li>

                    </ul>
                )}
            </div>

            {/* Right Sidebar for Sub-Sections */}
            {subSection && (
                <div className="sidebar">
                    <button className="close-button" onClick={() => setSubSection(null)}>X</button>
                    <h2>{subSection.replace(/([A-Z])/g, ' $1')}</h2>
                    {/* Display content dynamically based on subSection */}
                    {subSection === 'createBook' && <p>Here you can add a new book.</p>}
                    {subSection === 'viewBooks' && <p>View all available books in the system.</p>}
                    {subSection === 'updateBook' && <p>Update existing book information.</p>}
                    {/* Add similar conditional content for other sub-sections */}
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

                /* Compact fixed header */
                .dashboard-header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    padding: 10px 15px;
                    background-color: darkgreen;
                    color: white;
                    font-weight: bold;
                    font-size:1.2em;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
                    z-index: 1000;
                }

                .header-title {
                    font-size: 1.2em;
                    margin-bottom: 5px;
                }

                .header-nav {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
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
                    background-color:rgba(7, 78, 22, 0.49);
                }

                /* Main container styling */
                .dashboard-container {
                    text-align: left;
                    padding: 20px;
                    padding-top: 80px; /* Extra padding to push content below header */
                    background-color: #f4f4f4;
                    max-width: 120px;
                    height: 100vh;
                    overflow-y: auto;
                    position: fixed;
                    left: 0;
                    top: 50px; /* Starts below the header */
                    min-height: 100vh;
                     min-width: 212vh;
                    /* Ensure it fills the viewport height */
                    background: linear-gradient(to right, #f0f8ff, #d9eaf7);
                    background-image: url('/images/home1.jpeg');
                }

                .dashboard-menu {
                    list-style-type: none;
                    padding: 0;
                }

                .dashboard-menu li {
                    margin: 10px 0;
                    cursor: pointer;
                    padding: 10px;
                    max-width: 20vh;
                    background-color:rgb(143, 226, 164);
                    color: white;
                    border-radius: 5px;
                    transition: background-color 0.3s white;
                }

                .dashboard-menu li:hover {
                    background-color:rgb(243, 248, 245);
                }

                /* Right Sidebar */
                .sidebar {
                    position: fixed;
                    right: 0;
                    top: 50px; /* Starts below the header */
                    height: calc(100vh - 50px);
                    width: 35%;
                    background-color: #fff;
                    box-shadow: -2px 0px 6px rgba(0, 0, 0, 0.2);
                    padding: 20px;
                    overflow-y: auto;
                    z-index: 1100;
                }

                .sidebar h2 {
                    margin-top: 10px;
                    font-size: 1.4em;
                }

                .close-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background-color: transparent;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                }

                /* Responsive Layout */
                @media (max-width: 768px) {
                    .dashboard-container {
                        width: 100%;
                        position: relative;
                        max-width: 100%;
                    }
                    .sidebar {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
