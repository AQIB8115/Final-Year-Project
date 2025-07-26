import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DeleteBook = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/books/${id}`);
                const data = await response.json();
                setBook(data);
            } catch (error) {
                console.error('Error fetching book:', error);
            }
        };

        fetchBook();
    }, [id]);

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/books/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Book deleted successfully');
                navigate('/admin/all-books');
            } else {
                alert('Failed to delete book');
            }
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    if (!book) return <p>Loading...</p>;

    return (
        <div>
            <h2>Delete Book</h2>
            <p>Are you sure you want to delete "{book.Title}" by {book.Author}?</p>
            <button onClick={handleDelete}>Yes,<br></br> Delete</button><br></br>
            <button onClick={() => navigate('/admin/all-books')}>No, <br></br>Go Back</button>
        </div>
    );
};

export default DeleteBook;