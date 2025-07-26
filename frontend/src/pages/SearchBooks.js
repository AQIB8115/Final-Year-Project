import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // WebSocket connection

const SearchBooks = () => {
  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null); // User session data
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('query'); // Extract search query from URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem('userId');


      if (!userId) {
        console.log("User not logged in");
        return; // or redirect to login
      }
      try {



        
        // console.log('User ID:', userId); 
        const response = await fetch(`https://final-year-project-api-ten.vercel.app/api/users/${userId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const fetchBook = async () => {
      try {
        const response = await fetch(`https://final-year-project-api-ten.vercel.app/api/books?title=${searchQuery}`);
        const data = await response.json();

        console.log('Books data:', data); 
        if (data && data.length > 0) {
          const exactMatch = data.find((item) => item.Title.toLowerCase() === searchQuery.toLowerCase());
          setBook(exactMatch || null);
        } else {
          setBook(null);
        }
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    const timeout = setTimeout(() => {
      if (searchQuery) fetchBook();
    }, 300); // Wait for 300ms

    fetchUser();

    // Listen for book updates via WebSocket
    socket.on('bookUpdated', (updatedBook) => {
      if (book && book._id === updatedBook.bookId) {
        setBook((prevBook) => ({ ...prevBook, Status: updatedBook.Status }));
      }
    });

    return () => {
      clearTimeout(timeout);
      socket.off('bookUpdated'); // Clean up the listener
    };
  }, [searchQuery, book]);

  const handleReserve = async () => {
    if (!user) {
      navigate('/api/login', {
        state: { redirect: `/search-books?query=${searchQuery}`, bookId: book._id, type: 'reserve' },
      });
    } else if (book) {
      try {
        const response = await fetch(`https://final-year-project-api-ten.vercel.app/api/requests/reserve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ bookId: book._id }),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Book reserved successfully!');
          setBook((prevBook) => ({ ...prevBook, Status: 'Reserved' }));
        } else {
          alert(data.message || 'Failed to reserve the book.');
        }
      } catch (error) {
        console.error('Error reserving book:', error);
      }
    }
  };

  const handleBorrow = async () => {
    if (!user) {
      navigate('/api/login', {
        state: { redirect: `/search-books?query=${searchQuery}`, bookId: book._id, type: 'borrow' },
      });
    } else if (book) {
      try {
        const response = await fetch(`https://final-year-project-api-ten.vercel.app/api/requests/borrow`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ bookId: book._id, status: 'pending' }),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Your borrow request is pending approval from the admin!');
          setBook((prevBook) => ({ ...prevBook, Status: 'Pending Approval' }));
        } else {
          alert(data.message || 'Failed to borrow the book.');
        }
      } catch (error) {
        console.error('Error borrowing book:', error);
      }
    }
  };

  return (
    <div className="search-results-container">
      <h2>Search Results for "{searchQuery}"</h2>

      {book ? (
        <div className="selected-book-header">
          <h3>{book.Title}</h3>
          <div className="book-details-grid">
          <div><strong>Subtitle:</strong> {book.Subtitle}</div>
            <div><strong>Statement Responsibility:</strong> {book.StatementResponsibility}</div>
            <div><strong>Author:</strong> {book.Author}</div>
            <div><strong>Subauthor:</strong> {book.Subauthor}</div>
            <div><strong>Type:</strong> {book.Type}</div>
            {/* Book Identification */}
            <div><strong>AccNo:</strong> {book.AccNo}</div>
            <div><strong>ISBN:</strong> {book.ISBN}</div>
            <div><strong>DDC No:</strong> {book.DDC_No}</div>
            <div><strong>Auth Mark:</strong> {book.AUTH_Mark}</div>
            {/* Publisher Information */}
            <div><strong>Publisher:</strong> {book.Publisher}</div>
            <div><strong>Place:</strong> {book.Place}</div>
            <div><strong>Year:</strong> {book.Year}</div>
            <div><strong>Source:</strong> {book.Source}</div>
            <div><strong>Edition:</strong> {book.Edition}</div>
            <div><strong>Volume:</strong> {book.Volume}</div>
            {/* Physical Details */}
            <div><strong>Pages:</strong> {book.Pages}</div>
            <div><strong>Binding:</strong> {book.Binding}</div>
            <div><strong>Quantity:</strong> {book.Quantity}</div>
            <div><strong>Series:</strong> {book.Series}</div>
            <div><strong>Language:</strong> {book.Language}</div>
            {/* Book Status & Remarks */}
            <div><strong>Status:</strong> {book.Status}</div>
            <div><strong>Reference:</strong> {book.Reference ? 'Yes' : 'No'}</div>
            <div><strong>Remarks:</strong> {book.Remarks}</div>
            <div><strong>Notes:</strong> {book.Notes}</div>
            {/* Subject and Keywords */}
            <div><strong>Subject:</strong> {book.Subject}</div>
            <div><strong>Keyword:</strong> {book.keyword}</div>
            {/* Entry Date */}
            <div><strong>Entry Date:</strong> {new Date(book.EntryDate).toLocaleDateString()}</div>
          </div>

          <button onClick={handleReserve}>Reserve</button>
          <button onClick={handleBorrow}>Borrow</button>
        </div>
      ) : (
        <p>No books found for "{searchQuery}"</p>
      )}
      <style jsx>{`
      html, body {
  width:100vw;
  height: 100vh;
  mergin : 0;
  padding : 0;
  overflow: hidden;
    background: linear-gradient(to right, #f0f8ff, #d9eaf7); /* Smooth background gradient */
   background-image: url('/images/home1.13.jpg');  /* Path relative to the public folder */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  font-family: 'Arial', sans-serif;
}
        .search-results-container {
          padding: 20px;
          background: lightgrey;
        }
        .selected-book-header {
          padding: 20px;
          background: white;
          margin-top: 10px;
          border-radius: 5px;
        }
        button {
          margin-right: 10px;
          padding: 8px 12px;
          background-color:rgb(62, 150, 27);
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color:rgb(9, 46, 17);
        }
        .book-details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
      `}</style>
    </div>
  );
};

export default SearchBooks;
