import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AllBooks = () => {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/books');
                const data = await response.json();
                setBooks(data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, []);

    const handleEdit = (id) => {
        navigate(`/admin/update-book/${id}`);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this book?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5000/api/books/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setBooks(books.filter(book => book._id !== id));
                    alert('Book deleted successfully');
                } else {
                    alert('Failed to delete book');
                }
            } catch (error) {
                console.error('Error deleting book:', error);
            }
        }
    };

    const filteredBooks = books.filter(book =>
        book.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.Author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="books-container">
            <h2>All Books</h2>
            <input
                type="text"
                placeholder="Search by Title or Author"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
            />
            {filteredBooks.length > 0 ? (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Serial Number</th>
                                <th>Title</th>
                                <th>Subtitle</th>
                                <th>Statement Responsibility</th>
                                <th>Author</th>
                                <th>Subauthor</th>
                                <th>AccNo</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Entry Date</th>
                                <th>DDC No</th>
                                <th>AUTH Mark</th>
                                <th>Section</th>
                                <th>Reference</th>
                                <th>Publisher</th>
                                <th>Place</th>
                                <th>Year</th>
                                <th>Source</th>
                                <th>Edition</th>
                                <th>Volume</th>
                                <th>Pages</th>
                                <th>Series</th>
                                <th>Language</th>
                                <th>Quantity</th>
                                <th>ISBN</th>
                                <th>Binding</th>
                                <th>Status</th>
                                <th>Remarks</th>
                                <th>Contents</th>
                                <th>Notes</th>
                                <th>Subject</th>
                                <th>Keyword</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.map((book, index) => (
                                <tr key={book._id}>
                                    <td>{index + 1}</td>
                                    <td>{book.Title}</td>
                                    <td>{book.Subtitle}</td>
                                    <td>{book.StatementResponsibility}</td>
                                    <td>{book.Author}</td>
                                    <td>{book.Subauthor}</td>
                                    <td>{book.AccNo}</td>
                                    <td>{book.Type}</td>
                                    <td>{book.Price}</td>
                                    <td>{new Date(book.EntryDate).toLocaleDateString()}</td>
                                    <td>{book.DDC_No}</td>
                                    <td>{book.AUTH_Mark}</td>
                                    <td>{book.Section}</td>
                                    <td>{book.Reference ? 'Yes' : 'No'}</td>
                                    <td>{book.Publisher}</td>
                                    <td>{book.Place}</td>
                                    <td>{book.Year}</td>
                                    <td>{book.Source}</td>
                                    <td>{book.Edition}</td>
                                    <td>{book.Volume}</td>
                                    <td>{book.Pages}</td>
                                    <td>{book.Series}</td>
                                    <td>{book.Language}</td>
                                    <td>{book.Quantity}</td>
                                    <td>{book.ISBN}</td>
                                    <td>{book.Binding}</td>
                                    <td>{book.Status}</td>
                                    <td>{book.Remarks}</td>
                                    <td>{book.Contents}</td>
                                    <td>{book.Notes}</td>
                                    <td>{book.Subject}</td>
                                    <td>{book.keyword}</td>
                                    <td>
                                        <button onClick={() => handleEdit(book._id)} className="action-button edit">Edit</button>
                                        <button onClick={() => handleDelete(book._id)} className="action-button delete">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No books found</p>
            )}

            {/* <div className="back-button-container">
                <button onClick={() => navigate('/admin-dashboard')} className="back-button">Back</button>
            </div> */}

            <style jsx>{`
                  html, body {
                  width:100vw;
                  height: 100vh;
                  mergin : 0;
                  padding : 0;
                  overflow: hidden;
                  font-family: 'Arial', sans-serif;
                }
                .books-container {
                    height: 100vh;
                    width: 100vw;
                    margin: 0 auto;
                    padding: 20px;
                    background: lightgrey;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    overflow: auto;
                    
                }

                h2 {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #333;
                }

                .search-bar {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 20px;
                    border: 2px solid #ddd;
                    border-radius: 4px;
                    font-size: 16px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 500px;
                }

                thead {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    background-color: #f4f4f4;
                }

                th,
                td {
                    border: 2px solid #ddd;
                    padding: 8px;
                    text-align: left;
                    min-width: 100px;
                }

                th {
                    background-color: green;
                    color: white;
                    position: sticky;
                    top: 0;
                    z-index: 3;
                }

                td:first-child,
                th:first-child {
                    position: sticky;
                    left: 0;
                    background-color: green;
                    z-index: 4;
                    color: white;
                }

                tr:nth-child(even) {
                    background-color: lightgrey;
                }

                .table-wrapper {
                    overflow-x: auto;
                }

                .action-button {
                    margin-right: 10px;
                    padding: 5px 10px;
                    border: none;
                    color: white;
                    cursor: pointer;
                    border-radius: 4px;
                }

                .edit {
                    background-color: green;
                }

                .delete {
                    background-color: red;
                }

                .action-button:hover {
                    opacity: 0.8;
                }

                p {
                    text-align: center;
                    color: #777;
                }

                .back-button-container {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 20px;
                }

                .back-button {
                    padding: 10px 20px;
                    background-color: #333;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .back-button:hover {
                    background-color: #555;
                }
            `}</style>
        </div>
    );
};

export default AllBooks;
