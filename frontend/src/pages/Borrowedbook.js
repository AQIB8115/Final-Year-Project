
import React, { useEffect, useState } from 'react';

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await fetch('https://final-year-project-api-ten.vercel.app/api/all');
        if (!response.ok) {
          throw new Error(`Failed to fetch borrowed books: ${response.statusText}`);
        }

        const data = await response.json();
        setBorrowedBooks(data.borrowedBooks);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBorrowedBooks();
  }, []);

  const handleReturn = async (borrowId) => {
    try {
      const response = await fetch(`https://final-year-project-api-ten.vercel.app/api/return/${borrowId}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to return the book');
      }

      const result = await response.json();

      setBorrowedBooks((prevBooks) =>
        prevBooks.map((book) =>
          // book._id === borrowId ? { ...book, status: 'returned' } : book
      book._id === borrowId ? { ...book, status: 'returned', fine: result.fine } : book
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.borrowedBooksContainer}>
      <h2 style={styles.title}>Borrowed Books</h2>
      {error && <div style={styles.errorMessage}>{error}</div>}
      <table style={styles.borrowedBooksTable}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>User ID</th> {/* New column for User ID */}
            <th style={styles.tableHeader}>User</th>
            <th style={styles.tableHeader}>Role</th>
            <th style={styles.tableHeader}>Book Title</th>
            <th style={styles.tableHeader}>Author</th>
            <th style={styles.tableHeader}>Borrow Date</th>
            <th style={styles.tableHeader}>Due Date</th>
            <th style={styles.tableHeader}>Status</th>
            <th style={styles.tableHeader}>Fine</th> {/* New column for fine */}
            <th style={styles.tableHeader}>Action</th>
          </tr>
        </thead>
        <tbody>
          {borrowedBooks.map((borrowedBook) => (
            <tr key={borrowedBook._id}>
              <td style={styles.tableCell}>{borrowedBook.user.customID}</td> {/* Display User ID */}
              <td style={styles.tableCell}>{borrowedBook.user.username}</td>
              <td style={styles.tableCell}>{borrowedBook.user.role}</td>
              <td style={styles.tableCell}>{borrowedBook.book.Title}</td>
              <td style={styles.tableCell}>{borrowedBook.book.Author}</td>
              <td style={styles.tableCell}>{new Date(borrowedBook.borrowDate).toLocaleDateString()}</td>
              <td style={styles.tableCell}>{new Date(borrowedBook.dueDate).toLocaleDateString()}</td>
              <td style={styles.tableCell}>{borrowedBook.status}</td>
              <td style={styles.tableCell}>
                {borrowedBook.fine ? borrowedBook.fine : 'No fine'} {/* Display fine */}
              </td>
              <td style={styles.tableCell}>
                {borrowedBook.status === 'borrowed' && (
                  <button onClick={() => handleReturn(borrowedBook._id)} style={styles.returnBtn}>
                    Return
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  
  borrowedBooksContainer: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    margin: '0 auto',
    maxWidth: '1200px',
    marginTop: '160px',
    overflowX: 'auto',
    // backgroundImage: 'url("/images/home1.5.jpg")', // Replace with your image URL
    backgroundSize: 'cover',  // Ensures the image covers the entire container
    backgroundPosition: 'center',  // Centers the image
    backgroundRepeat: 'no-repeat'
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '1.1rem',
  },
  borrowedBooksTable: {
    width: '170vh',
    borderCollapse: 'collapse',
    margin: '20px 0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    // backgroundColor: '#fff',
    color: 'black',
    tableLayout: 'auto',
  },
  tableHeader: {
    padding: '10px 15px',
    textAlign: 'left',
    // backgroundColor: 'darkgreen',
    borderBottom: '2px solid #ddd',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: '10px 15px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left',
  },
  returnBtn: {
    padding: '8px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default BorrowedBooks;
