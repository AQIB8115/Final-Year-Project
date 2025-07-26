// ReserveBook.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ReserveBook = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch book details using bookId
    fetch(`https://final-year-project-api-ten.vercel.app/api/books/${bookId}`)
      .then((response) => response.json())
      .then((data) => setBook(data))
      .catch((err) => console.error(err));
  }, [bookId]);

  const handleReserve = () => {
    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
    
    fetch(`https://final-year-project-api-ten.vercel.app/api/reserve-book/${bookId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Book successfully reserved.') {
          alert('Book reserved successfully');
          navigate('/student-dashboard');
        } else {
          alert(data.message);
        }
      })
      .catch((err) => console.error(err));
  };

  if (!book) {
    return <div>Loading book details...</div>;
  }

  return (
    <div>
      <h2>{book.title}</h2>
      <button onClick={handleReserve}>Reserve Book</button>
    </div>
  );
};

export default ReserveBook;
