

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DeletePc = () => {
    const { id } = useParams();  
    const [pc, setPc] = useState(null);  
    const navigate = useNavigate();  

    useEffect(() => {
        const fetchPc = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/pcs/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch PC');
                }
                const data = await response.json();
                setPc(data);  
            } catch (error) {
                console.error('Error fetching PC:', error);
            }
        };

        fetchPc();
    }, [id]);  

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/pcs/${id}`, {
                method: 'DELETE',  
            });

            if (response.ok) {
                alert('PC deleted successfully');
                navigate('/admin/list-pc');  
            } else {
                const errorData = await response.json();
                alert(`Failed to delete PC: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error deleting PC:', error);
        }
    };

    if (!pc) return <p style={styles.loading}>Loading...</p>;  

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Delete PC</h2>
            <p style={styles.text}>
                Are you sure you want to delete PC Number "<strong>{pc.PC_Number}</strong>" with status "<strong>{pc.status}</strong>"?
            </p>
            <div style={styles.buttonContainer}>
                <button style={styles.deleteButton} onClick={handleDelete}> Delete</button>
                <button style={styles.cancelButton} onClick={() => navigate('/admin/list-pc')}>Go Back</button>
            </div>
        </div>
    );
};

// Internal CSS styles
const styles = {
    container: {
        maxWidth: '500px',
        margin: '50px auto',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        textAlign: 'center',
        // backgroundImage: 'url("/images/home1.5.jpg")', // Replace with your image URL
        backgroundSize: 'cover',  // Ensures the image covers the entire container
        backgroundPosition: 'center',  // Centers the image
        backgroundRepeat: 'no-repeat',
        fontFamily: 'Arial, sans-serif'
    },
    heading: {
        color: '#d9534f',
        marginBottom: '20px',
    },
    text: {
        fontSize: '16px',
        color: 'black',
        marginBottom: '20px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
    },
    deleteButton: {
        backgroundColor: '#d9534f',
        color: '#fff',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    cancelButton: {
        backgroundColor: '#5bc0de',
        color: '#fff',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    loading: {
        textAlign: 'center',
        fontSize: '18px',
        marginTop: '50px',
    }
};

export default DeletePc;
