import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BookDetails = () => {
    const { AccNo } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch book details from backend
        fetch(`http://localhost:5000/api/${AccNo}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch book details');
                }
                return response.json();
            })
            .then(data => {
                setBook(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching book details:', error);
                setLoading(false);
            });
    }, [AccNo]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!book) {
        return <p>Book not found!</p>;
    }

    return (
        <div style={styles.container}>
            <h1>Book Details</h1>
            <div style={styles.detailContainer}>
                <div style={styles.column}>
                    <p><strong>Call No:</strong> {book.DDC_No}</p>
                    <p><strong>Title:</strong> {book.Title}</p>
                    <p><strong>Acc No:</strong> {book.AccNo}</p>
                    <p><strong>Author:</strong> {book.Author}</p>
                </div>
                <div style={styles.column}>
                    <p><strong>DDC No:</strong> {book.DDC_No}</p>
                    <p><strong>Auth Mark:</strong> {book.AUTH_mark || 'N/A'}</p>
                    <p><strong>Year:</strong> {book.Year}</p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    detailContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#fff',
        padding: '15px',
    },
    column: {
        width: '48%',
    },
};

export default BookDetails;
