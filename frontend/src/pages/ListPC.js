
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ListPC = () => {
    const [pcs, setPcs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPCs = async () => {
            try {
                const response = await axios.get('https://final-year-project-api-ten.vercel.app/api/pcs');
                console.log('Fetched PCs:', response.data);
                setPcs(response.data);
            } catch (error) {
                console.error('Error fetching PCs:', error);
                setError('Failed to fetch PCs');
            }
        };
        fetchPCs();
    }, []);

    return (
        <div className="list-pc-container">
            <h2>List of PCs</h2>
            {error && <p className="error-message">{error}</p>}
            <table className="pc-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>PC Number</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pcs.length > 0 ? (
                        pcs.map((pc, index) => (
                            <tr key={pc._id}>
                                <td>{index + 1}</td>
                                <td>{pc.pc_Number}</td>
                                <td>{pc.status}</td>
                                <td>
                                    <Link to={`/admin/update-pc/${pc._id}`} className="action-link">Edit</Link>
                                    <Link to={`/admin/delete-pc/${pc._id}`} className="action-link">Delete</Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="no-pcs">No PCs found</td>
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
                background-image: url('/images/home1.5.jpg');  /* Path relative to the public folder */
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                font-family: 'Arial', sans-serif;
            }

                .list-pc-container {
                    width: 150vh;
                    margin:  auto;
                    background-color:rgb(238, 234, 236);
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                h2 {
                    text-align: center;
                    color: black;
                    font-size: 2em;
                    min-height: 7vh;
                    {/* background-color:rgb(10, 66, 8); */}
                    margin-bottom: 5px;
                }

                .error-message {
                    color: red;
                    text-align: center;
                    margin-bottom: 15px;
                }

                .pc-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 1.5em;
                    font-family: Arial, sans-serif;
                    
                }

                .pc-table th, .pc-table td {
                    text-align: left;
                    padding: 10px;
                    border: 1px solid #ddd;
                }

                .pc-table th {
                    {/* background-color: #0072ff; */}
                    color: black;
                    text-transform: uppercase;
                }

                .pc-table tr:nth-child(even) {
                    {/* background-color: #f2f2f2; */}
                }

                .pc-table tr:hover {
                    background-color: #ddd;
                }

                .action-link {
                    margin-right: 10px;
                    text-decoration: none;
                    color:rgb(10, 24, 7);
                    font-weight: bold;
                }

                .action-link:hover {
                    text-decoration: underline;
                }

                .no-pcs {
                    text-align: center;
                    color: #555;
                    padding: 15px;
                }

                @media (max-width: 600px) {
                    .list-pc-container {
                        padding: 10px;
                    }

                    .pc-table th, .pc-table td {
                        padding: 8px;
                        font-size: 14px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ListPC;
