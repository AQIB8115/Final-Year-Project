import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const CreatePC = () => {
    const [form, setForm] = useState({ pc_Number: '', status: '' });
    const navigate = useNavigate(); // Initialize useNavigate

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form data:', form); // Check if pc_Number is being sent properly
    if (!form.pc_Number) {
        alert('PC Number is required');
        return;
    }
        try {
            const response = await axios.post('https://final-year-project-api-ten.vercel.app/api/pcs', form, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
            alert('PC created successfully');
            console.log('Response:', response.data);
            // alert('PC created successfully');
            setForm({ pc_Number: '', status: '' });

            // After PC creation, navigate to the list of PCs page
            navigate('/admin/list-pc'); // Change '/pcs' to the correct route for the PC list page
        } catch (error) {
            console.error('Error response:', error.response?.data || error.message);
        alert(error.response?.data.error || 'Error creating PC');

    }
    };

    return (
        <div className="container">
            <h2>Create a New PC</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <input
                    type="number"
                    name="pc_Number"
                    placeholder="PC Number"
                    value={form.pc_Number}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                />
                <input
                    type="text"
                    name="status"
                    placeholder="Status"
                    value={form.status}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                />
                <button type="submit" className="submit-btn">Create PC</button>
            </form>

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
                .container {
                    max-width: 120vh;
                    margin: 0 auto;
                    padding: 20px;
                    {/* background-color:rgb(16, 94, 0); */}
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    
                }
                

                h2 {
                    text-align: center;
                    font-size: 1.6em;
                    margin-bottom: 20px;
                    color: black;
                }

                .form-container {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    
                }

                .input-field {
                    padding: 10px;
                    font-size: 1em;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    width: 100%;
                    box-sizing: border-box;
                }

                .input-field:focus {
                    outline: none;
                    border-color:rgb(33, 192, 28);
                }

                .submit-btn {
                    padding: 12px;
                    background-color:rgb(23, 161, 23);
                    color: white;
                    font-size: 1em;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .submit-btn:hover {
                    background-color:rgb(4, 65, 22);
                }

                /* Responsive Styles */
                @media (max-width: 768px) {
                    .container {
                        padding: 15px;
                    }

                    h2 {
                        font-size: 1.4em;
                    }
                }

                @media (max-width: 480px) {
                    .container {
                        padding: 10px;
                    }

                    .input-field {
                        font-size: 0.9em;
                        padding: 8px;
                    }

                    .submit-btn {
                        font-size: 0.9em;
                        padding: 10px;
                    }
                }
            `}</style>
        </div>
    );
};

export default CreatePC;
