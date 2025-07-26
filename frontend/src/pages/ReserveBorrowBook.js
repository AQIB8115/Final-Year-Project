import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const ReserveBorrowBook = ({ type }) => {
    const { bookId } = useParams(); // Extract bookId from the route
    const navigate = useNavigate();
    const location = useLocation();
    const [message, setMessage] = useState('');

    const [loading, setLoading] = useState(false);

    const handleRequest = async () => {
        setLoading(true);
        console.log('Sending request with bookId:', bookId, 'and type:', type);
        try {
            const response = await fetch('http://localhost:5000/api/requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ bookId, type }),
            });

            const data = await response.json();
            console.log('Response from backend:', data); // Debug response

            if (response.ok) {
                setMessage(`Request ${type} successfully created!`);
                setTimeout(() => navigate(location.state?.from || '/'), 3000); // Redirect after 3 seconds
            } else {
                setMessage(data.message || 'An error occurred');
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            setMessage('Failed to create request. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>{type === 'reserve' ? 'Reserve Book' : 'Borrow Book'}</h2>
            <p>Are you sure you want to {type} this book?</p>
            <button onClick={handleRequest} disabled={loading }>
            {loading ? 'Processing...': type === 'reserve' ? 'Reserve' : 'Borrow'}</button>
            {message && <p style={{color: loading ? 'blue' : 'red' }}>{message}</p>}
        </div>
    );
};

export default ReserveBorrowBook;
//  = () => <ReserveBorrowBook type="reserve" />;
// export const BorrowBook = () => <ReserveBorrowBook type="borrow" />;
