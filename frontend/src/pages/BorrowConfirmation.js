import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BorrowConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookId, userId } = location.state || {};
    const [book, setBook] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch book details
        const fetchBookDetails = async () => {
            try {
                const response = await fetch(`https://final-year-project-api-ten.vercel.app/api/books/${bookId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch book details');
                }
                const data = await response.json();
                setBook(data);
            } catch (error) {
                setError('Error fetching book details');
            }
        };

        // Fetch user details
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`https://final-year-project-api-ten.vercel.app/api/users/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                setError('Error fetching user details');
            }
        };

        if (bookId && userId) {
            fetchBookDetails();
            fetchUserDetails();
        }
    }, [bookId, userId]);

    const handleConfirmBorrow = async () => {
        try {
            const response = await fetch('https://final-year-project-api-ten.vercel.app/api/borrow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId, userId }),
            });

            if (!response.ok) {
                throw new Error('Error borrowing book');
            }
            alert('Book borrowed successfully!');
            navigate('/student-dashboard');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="confirmation-container">
            <h2>Confirm Borrow</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {book && user ? (
                <div>
                    <h3>Book Details:</h3>
                    <div><strong>Title:</strong> {book.Title}</div>
                    <div><strong>Author:</strong> {book.Author}</div>
                    <div><strong>Price:</strong> {book.Price ? `$${book.Price}` : 'N/A'}</div>

                    <h3>User Details:</h3>
                    <div><strong>Name:</strong> {user.name}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>Student ID:</strong> {user.studentId || 'N/A'}</div>
                    <div><strong>Employee ID:</strong> {user.employeeId || 'N/A'}</div>
                    <div><strong>Phone:</strong> {user.phone || 'N/A'}</div>
                    <div><strong>Role:</strong> {user.role || 'N/A'}</div>

                    <button onClick={handleConfirmBorrow}>Confirm Borrow</button>
                </div>
            ) : (
                <p>Loading details...</p>
            )}
        </div>
    );
};

export default BorrowConfirmation;
