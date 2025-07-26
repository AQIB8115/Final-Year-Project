
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AllBooks = () => {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [searchActive, setSearchActive] = useState(false);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch userId from localStorage when the component mounts
        const storedUserId = localStorage.getItem('userId');
        console.log('Stored userId:', storedUserId);  // Debug log
        if (storedUserId) {
            setUserId(storedUserId);  // Set userId if found
        }
    }, []);

    const fetchBooks = async () => {
        if (searchQuery) {
            try {
                const response = await fetch(`http://localhost:5000/api/books?search=${searchQuery}`, {
                credentials: 'include',
            });
                const data = await response.json();
                setBooks(data);
                setSearchActive(true);
                setError('');
            } catch (error) {
                setError('Error fetching books');
                setBooks([]);
            }
        } else {
            setBooks([]);
            setSearchActive(false);
        }
    };

    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query === '') {
            setBooks([]);
            setSearchActive(false);
        }
    };

    const handleSearchButtonClick = () => {
        fetchBooks();
    };

    const handleBorrowBook = async (bookId) => {
        if (!userId) {
            alert('Please log in first!');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/requests/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    bookId, 
                    // userId 
                    type: 'borrow',
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Your borrow request has been sent to the librarian for approval.');
                // alert(`Book borrowed successfully! Due date: ${data.borrowDetails.dueDate}`);
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error borrowing book:', error);
            alert('Error processing borrow request');
        }
    };

    const filteredBooks = books.filter((book) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            book.Title.toLowerCase().includes(searchTerm) ||
            book.Author.toLowerCase().includes(searchTerm) ||
            book.Subtitle?.toLowerCase().includes(searchTerm) ||
            book.keyword?.toLowerCase().includes(searchTerm)
        );
    });

    return (
        <div className="books-container">
            <h2>Search Books</h2>

            {/* Search Container */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by Title, Author, or Keyword"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="search-bar"
                />
                <button onClick={handleSearchButtonClick} className="search-button">
                    Search
                </button>
            </div>

            {error && <p>{error}</p>}

            {filteredBooks.length > 0 && searchActive ? (
                <div className="books-list">
                    {filteredBooks.map((book, index) => (
                        <div key={book._id} className="book-item">
                            <h3>Book {index + 1}</h3>
                            <div className="book-details">
                                <div><strong>Title:</strong> {book.Title}</div>
                                <div><strong>Subtitle:</strong> {book.Subtitle || 'N/A'}</div>
                                <div><strong>Author:</strong> {book.Author}</div>
                                <div><strong>Subauthor:</strong> {book.Subauthor || 'N/A'}</div>
                                <div><strong>Type:</strong> {book.Type || 'N/A'}</div>
                                <div><strong>AccNo:</strong> {book.AccNo}</div>
                                <div><strong>Price:</strong> {book.Price ? `$${book.Price}` : 'N/A'}</div>
                                <div><strong>Entry Date:</strong> {new Date(book.EntryDate).toLocaleDateString()}</div>
                                <div><strong>DDC No:</strong> {book.DDC_No || 'N/A'}</div>
                                <div><strong>AUTH Mark:</strong> {book.AUTH_Mark || 'N/A'}</div>
                                <div><strong>Section:</strong> {book.Section || 'N/A'}</div>
                                <div><strong>Reference:</strong> {book.Reference ? 'Yes' : 'No'}</div>
                                <div><strong>Publisher:</strong> {book.Publisher || 'N/A'}</div>
                                <div><strong>Place:</strong> {book.Place || 'N/A'}</div>
                                <div><strong>Year:</strong> {book.Year || 'N/A'}</div>
                                <div><strong>Source:</strong> {book.Source || 'N/A'}</div>
                                <div><strong>Edition:</strong> {book.Edition || 'N/A'}</div>
                                <div><strong>Volume:</strong> {book.Volume || 'N/A'}</div>
                                <div><strong>Pages:</strong> {book.Pages || 'N/A'}</div>
                                <div><strong>Series:</strong> {book.Series || 'N/A'}</div>
                                <div><strong>Language:</strong> {book.Language || 'N/A'}</div>
                                <div><strong>Quantity:</strong> {book.Quantity}</div>
                                <div><strong>ISBN:</strong> {book.ISBN || 'N/A'}</div>
                                <div><strong>Binding:</strong> {book.Binding || 'N/A'}</div>
                                <div><strong>Status:</strong> {book.Status || 'N/A'}</div>
                                <div><strong>Remarks:</strong> {book.Remarks || 'N/A'}</div>
                                <div><strong>Contents:</strong> {book.Contents || 'N/A'}</div>
                                <div><strong>Notes:</strong> {book.Notes || 'N/A'}</div>
                                <div><strong>Subject:</strong> {book.Subject || 'N/A'}</div>
                                <div><strong>Keyword:</strong> {book.keyword || 'N/A'}</div>
                                <button
                                    onClick={() => handleBorrowBook(book._id)}
                                    className="borrow-button"
                                >
                                    Borrow
                                </button> 
                                <button
                                    onClick={() => handleBorrowBook(book._id)}
                                    className="borrow-button"
                                >
                                    Reserve
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No books found</p>
            )}

            <style jsx>{`
                /* Main container styling to cover full page */
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
                .books-container {
                    max-width: 100%;
                    height: 100vh;
                    margin: 0 auto;
                    padding: 20px;
                    {/* background-color:rgb(8, 58, 10); */}
                    border-radius: 10px;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                    overflow-y: auto;
                }

                h2 {
                    font-size: 2rem;
                    color:rgb(11, 13, 14);
                    text-align: center;
                    margin-bottom: 20px;
                }

                .search-container {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 20px;
                }

                .search-bar {
                    width: 300px;
                    padding: 10px;
                    font-size: 1rem;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    transition: all 0.3s;
                }

                .search-bar:focus {
                    border-color: #3498db;
                }

                .search-button {
                    padding: 10px 20px;
                    font-size: 1rem;
                    background-color:rgb(25, 122, 49);
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .search-button:hover {
                    background-color:rgb(10, 68, 36);
                }

                /* Books list styling */
                .books-list {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .book-item {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    background-color: #ffffff;
                    padding: 15px;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                }

                .book-item:hover {
                    transform: translateY(-5px);
                }

                /* Book details container for landscape */
                .book-details {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr); /* Three columns for wide layout */
                    gap: 10px;
                    margin-left: 20px;
                    width: 100%;
                }

                .book-details div {
                    font-size: 0.9rem;
                    color: #555;
                    margin: 5px 0;
                }

                .book-details strong {
                    color: #333;
                }

                .borrow-button {
                    padding: 10px 20px;
                    background-color: #27ae60;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .borrow-button:hover {
                    background-color: #2ecc71;
                }
            `}</style>
        </div>
    );
};

export default AllBooks;
