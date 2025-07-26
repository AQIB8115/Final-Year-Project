
import React, { useEffect, useState } from 'react';

const SpineLabel = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(''); // For search query

    useEffect(() => {
        // Fetch all books from backend
        fetch('https://final-year-project-api-ten.vercel.app/api/books')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }
                return response.json();
            })
            .then(data => {
                setBooks(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching books:', error);
                setLoading(false);
            });
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Split the searchQuery by commas and trim extra spaces
    const searchAccNos = searchQuery.split(',').map(query => query.trim());

    // Filter books by AccNo based on the search query
    const filteredBooks = books.filter(book =>
        searchAccNos.some(accNo => book.AccNo.toString().includes(accNo))
    );

    if (loading) {
        return <p>Loading...</p>;
    }

    if (filteredBooks.length === 0) {
        return <p>No books found!</p>;
    }

    return (
        <div style={styles.container}>
            <h1>Spine Labels</h1>
            {/* Search bar */}
            <input
                type="text"
                placeholder="Search by Acc No (comma separated)"
                value={searchQuery}
                onChange={handleSearchChange}
                style={styles.searchBar}
            />
            <div style={styles.gridContainer}>
                {filteredBooks.map((book, index) => (
                    <div key={index} style={styles.card}>
                        <div style={styles.detailContainer}>
                            <div style={styles.column}>
                                <p><strong>Call No:</strong> {book.DDC_No}</p>
                                <p><strong>Title:</strong> {book.Title}</p>
                                <p><strong>Acc No:</strong> {book.AccNo}</p>
                                <p><strong>Author:</strong> {book.Author}</p>
                            </div>
                            <div style={styles.column}>
                                <p><strong>DDC No:</strong> {book.DDC_No}</p>
                                <p><strong>Auth Mark:</strong> {book.AUTH_mark || 'N/A'}</p>
                                <p><strong>Year:</strong> {book.Year}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
const styles = {
    
    
    container: {
        width: '100vw',
        margin: '0 auto',
        padding: '25px',
        marginTop: '60vh',  // Added marginTop to move the container down from the top
        backgroundColor: 'darkgreen',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    searchBar: {
        width: '100%',
        marginTop: '20px',
        padding: '10px',
        marginBottom: '20px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(800px, 1fr))',
        gap: '20px',
    },
    card: {
        padding: '15px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#fff',
        boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
    },
    detailContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    column: {
        width: '48%',
    },
};
export default SpineLabel;
