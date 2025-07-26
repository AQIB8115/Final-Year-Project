
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BorrowBook from './BorrowBook';

const UserBookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('https://final-year-project-api-ten.vercel.app/user/books');
        setBooks(response.data.books);
        setFilteredBooks(response.data.books);
        setLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = books.filter(
      (book) =>
        book.Title.toLowerCase().includes(query) ||
        book.Author.toLowerCase().includes(query)
    );
    setFilteredBooks(filtered);
  };

  const handleBorrowClick = (book) => {
    setSelectedBook(book);
  };

  const handleReturnClick = async (BookID, borrowId) => {
    try {
      await axios.post(`https://final-year-project-api-ten.vercel.app/return/${borrowId}`);
      alert("Book returned successfully.");

      setBooks(books.map(book => book.BookID === BookID ? { ...book, Quantity: book.Quantity + 1 } : book));
      setFilteredBooks(filteredBooks.map(book => book.BookID === BookID ? { ...book, Quantity: book.Quantity + 1 } : book));
    } catch (error) {
      alert("Error returning the book: " + error.message);
    }
  };

  const handleCloseBorrowForm = () => {
    setSelectedBook(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="book-list-container">
      <h1>All Available Books</h1>

      <input
        type="text"
        placeholder="Search by Title or Author"
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Book ID</th>
              <th>Acc No</th>
              <th>Title</th>
              <th>Subtitle</th>
              <th>Author</th>
              <th>Quantity</th>
              <th>Action</th>
              <th>Return</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <tr key={book.BookID}>
                  <td>{book.BookID}</td>
                  <td>{book.AccNo}</td>
                  <td>{book.Title}</td>
                  <td>{book.Subtitle}</td>
                  <td>{book.Author}</td>
                  <td>{book.Quantity}</td>
                  <td>
                    <button onClick={() => handleBorrowClick(book)}>
                      Borrow
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleReturnClick(book.BookID, book.borrowId)}
                      disabled={book.Quantity >= book.TotalQuantity}
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No books found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedBook && (
        <BorrowBook book={selectedBook} onClose={handleCloseBorrowForm} />
      )}
      <style jsx>{`
        .book-list-container {
          padding: 20px;
          max-width: 900px;
          margin: 0 auto;
        }

        h1 {
          margin-bottom: 10px;
          text-align: center;
        }

        .search-bar {
          display: block;
          margin: 0 auto 20px;
          padding: 10px;
          width: 80%;
          max-width: 400px;
          border: 1px solid #ccc;
          border-radius: 4px;
          position: sticky;
          top: 0;
          z-index: 1;
          background-color: white;
        }

        .table-container {
          max-height: 400px;
          overflow-y: auto;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        thead {
          position: sticky;
          top: 0;
          background-color: #f4f4f4;
          z-index: 1;
        }

        th, td {
          padding: 10px;
          border: 1px solid #ddd;
        }

        tbody tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        tbody tr:nth-child(odd) {
          background-color: #fff;
        }

        button {
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          background-color: #007bff;
          color: white;
          cursor: pointer;
        }

        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default UserBookList;
