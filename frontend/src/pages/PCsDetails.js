
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PCsDetails = () => {
    const [pcs, setPcs] = useState([]);  // Default to empty array
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Fetching PCs from API...');
        fetch('http://localhost:5000/api/getUserViewPcs')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log('Data fetched:', data);  // Log the data to check its structure
            setPcs(Array.isArray(data) ? data : []);  // Ensure pcs is always an array
            setLoading(false);
        })
        .catch(error => console.error('Error fetching PCs:', error));
    }, []);

    const handleReserve = (id) => {
        navigate(`/reserve-time/${id}`);
    };

    if (loading) return <p>Loading PCs...</p>;

    if (!Array.isArray(pcs) || pcs.length === 0) {
        return <p>No PCs available</p>;
    }

    return (
        <div className="container">
            <h1>PC List</h1>
            <div className="table-container">
                <table className="pc-table">
                    <thead>
                        <tr>
                            <th>PC Number</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pcs.map(pc => (
                            <tr key={pc.id}>
                                <td>{pc.PC_Number}</td>
                                <td>{pc.status}</td>
                                <td>
                                    <button
                                        onClick={() => handleReserve(pc.id)}
                                        disabled={pc.status === 'reserved'}
                                        className="reserve-btn"
                                    >
                                        {pc.status === 'reserved' ? 'Reserved' : 'Reserve'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <style jsx>{`
       
            html, body {
                width:100vw;
                height: 100vh;
                mergin : 0;
                padding : 0;
                overflow: hidden;
                background: linear-gradient(to right, #f0f8ff, #d9eaf7); /* Smooth background gradient */
                background-image: url('/images/home1.11.jpg');  /* Path relative to the public folder */
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat
                font-family: 'Arial', sans-serif;
            }
                .container {
                    max-width: 1000px;
                    margin: 20px auto;
                    min-width: 150vh;
                    padding: 20px;
                    background-color: darkgreen;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    {/* font-family: 'Arial', sans-serif; */}
                    
                    position: relative;
                    padding-top: 60px;
                }

                h1 {
                    text-align: center;
                    font-size: 3em;
                    background-color:rgb(32, 139, 55);
                    color: black;
                    min-height :8vh; 
                    margin-bottom: 20px;
                }

                .table-container {
                
                    overflow-y: auto;
                    max-height: 500px;
                    border-top: 2px solid #ccc;
                }

                .pc-table {
                    
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                .pc-table th, .pc-table td {
                    padding: 12px;
                    text-align: center;
                    
                    border-bottom: 1px solid #ddd;
                }

                .pc-table th {
                    background-color: #f4f4f4;
                    font-size: 2em;
                }

                .pc-table td {
                    font-size: 2em;
                    background-color: #f4f4f4;
                    color: black;
                }

                .reserve-btn {
                    padding: 10px 20px;
                    background-color:rgb(12, 116, 26);
                    color: white;
                    font-size: 1em;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .reserve-btn:hover {
                    background-color:rgb(7, 51, 17);
                }

                .reserve-btn:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }

                .time-options {
                    margin-top: 10px;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    gap: 20px;
                }

                .time-options label {
                    font-size: 0.9em;
                    color: #333;
                }

                .manual-time-input {
                    margin-top: 5px;
                    padding: 8px;
                    font-size: 1em;
                    width: 100px;
                    border-radius: 5px;
                    border: 1px solid #ccc;
                    box-sizing: border-box;
                }

                .manual-time-input:focus {
                    outline: none;
                    border-color: #007bff;
                }

                /* Responsive Styles */
                @media (max-width: 768px) {
                    .container {
                        padding: 15px;
                    }

                    h1 {
                        font-size: 1.5em;
                    }

                    .pc-table {
                        font-size: 0.9em;
                    }
                }

                @media (max-width: 480px) {
                    .container {
                        padding: 10px;
                    }

                    .time-options {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .manual-time-input {
                        width: 150px;
                    }

                    .reserve-btn {
                        font-size: 0.9em;
                        padding: 8px 15px;
                    }
                }
            `}</style>
        </div>
    );
};

export default PCsDetails;
