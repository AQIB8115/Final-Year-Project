

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateBook = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const navigate = useNavigate();

    // Fetch the book details
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/books/${id}`);
                if (!response.ok) throw new Error('Failed to fetch book details');
                const data = await response.json();
                setBook(data);
            } catch (error) {
                console.error('Error fetching book:', error);
                alert('Error loading book data. Please try again later.');
            }
        };

        fetchBook();
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBook((prevBook) => ({
            ...prevBook,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Submit the form and update the book
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/books/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book),
            });
            if (response.ok) {
                alert('Book updated successfully');
                navigate('/all-books');
            } else {
                alert('Failed to update the book');
            }
        } catch (error) {
            console.error('Error updating book:', error);
            alert('Error updating the book. Please try again later.');
        }
    };

    // Render a loading state while fetching book data
    if (!book) return <p>Loading...</p>;

    return (
        <div className="update-book-container">
            <h2>Update Book</h2>
            <form onSubmit={handleSubmit} className="book-form">
                {[
                    { label: 'Title', name: 'Title', type: 'text', required: true },
                    { label: 'Subtitle', name: 'Subtitle', type: 'text' },
                    { label: 'Statement Responsibility', name: 'StatementResponsibility', type: 'text' },
                    { label: 'Author', name: 'Author', type: 'text', required: true },
                    { label: 'Subauthor', name: 'Subauthor', type: 'text' },
                    { label: 'Type', name: 'Type', type: 'text' },
                    { label: 'AccNo', name: 'AccNo', type: 'number' },
                    { label: 'Price', name: 'Price', type: 'number' },
                    { label: 'Entry Date', name: 'EntryDate', type: 'date' },
                    { label: 'DDC No', name: 'DDC_No', type: 'text' },
                    { label: 'AUTH Mark', name: 'AUTH_Mark', type: 'text' },
                    { label: 'Section', name: 'Section', type: 'number' },
                    { label: 'Publisher', name: 'Publisher', type: 'text' },
                    { label: 'Place', name: 'Place', type: 'text' },
                    { label: 'Year', name: 'Year', type: 'number' },
                    { label: 'Source', name: 'Source', type: 'text' },
                    { label: 'Edition', name: 'Edition', type: 'text' },
                    { label: 'Volume', name: 'Volume', type: 'text' },
                    { label: 'Pages', name: 'Pages', type: 'number' },
                    { label: 'Series', name: 'Series', type: 'text' },
                    { label: 'Language', name: 'Language', type: 'text' },
                    { label: 'Quantity', name: 'Quantity', type: 'number' },
                    { label: 'ISBN', name: 'ISBN', type: 'text' },
                    { label: 'Binding', name: 'Binding', type: 'text' },
                    { label: 'Status', name: 'Status', type: 'text' },
                    { label: 'Remarks', name: 'Remarks', type: 'text' },
                    { label: 'Contents', name: 'Contents', type: 'text' },
                    { label: 'Notes', name: 'Notes', type: 'text' },
                    { label: 'Subject', name: 'Subject', type: 'text' },
                    { label: 'Keyword', name: 'keyword', type: 'text' },
                ].map((field, index) => (
                    <div key={index}>
                        <label>{field.label}</label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={book[field.name] || ''}
                            onChange={handleChange}
                            required={field.required || false}
                            placeholder={`Enter ${field.label}`}
                        />
                    </div>
                ))}
                <div>
                    <label>Reference</label>
                    <input
                        type="checkbox"
                        name="Reference"
                        checked={book.Reference || false}
                        onChange={handleChange}
                    />
                    <span>Reference</span>
                </div>
                <button type="submit">Update Book</button>
            </form>

            <style jsx>{`
            .update-book-container {
                margin: 20px;
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 8px;
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
                max-width: 1200px;
                margin: 0 auto;
                position: relative;
                height: calc(100vh - 40px);
                overflow-y: auto;
                }

                 h2 {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #333;
                }

            .book-form {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 15px;
                
            }

            .book-form div {
                display: flex;
                flex-direction: column;
            }

            .book-form label {
                margin-bottom: 15px;
                font-weight: bold;
            }

            .book-form input[type="text"],
            .book-form input[type="number"],
            .book-form input[type="date"] {
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }

            .book-form input[type="checkbox"] {
                margin-right: 10px;
            }

            button {
                grid-column: span 1;
                padding: 10px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            button:hover {
                background-color: #0056b3;
            }
            `}</style>
        </div>
    );
};

export default UpdateBook;
