
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const UpdatePC = () => {
    const [pc, setPc] = useState({
        pc_Number: '',  
        status: ''
    });

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPC = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/pcs/${id}`);
                setPc(response.data);
            } catch (error) {
                console.error('Error fetching PC:', error);
            }
        };
        fetchPC();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPc(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/pcs/${id}`, pc);
            navigate('/admin/list-pc'); 
        } catch (error) {
            console.error('Error updating PC:', error);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Update PC</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="pc_Number" style={styles.label}>PC Number:</label>
                    <input
                        type="text"
                        id="pc_Number"
                        name="pc_Number"
                        value={pc.pc_Number}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="status" style={styles.label}>Status:</label>
                    <input
                        type="text"
                        id="status"
                        name="status"
                        value={pc.status}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>Update</button>
            </form>
        </div>
    );
};

// Internal CSS styles
const styles = {
    container: {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
        backgroundImage: 'url("/images/home1.1.jpg")', // Replace with your image URL
        backgroundSize: 'cover',  // Ensures the image covers the entire container
        backgroundPosition: 'center',  // Centers the image
        backgroundRepeat: 'no-repeat'  // Prevents image repetition
    },
    heading: {
        marginBottom: '20px',
        color: '#333'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    formGroup: {
        marginBottom: '15px',
        textAlign: 'left'
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: 'black'
    },
    input: {
        width: '100%',
        padding: '8px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '16px'
    },
    button: {
        backgroundColor: 'green',
        color: '#fff',
        padding: '10px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer'
    }
};


export default UpdatePC;
