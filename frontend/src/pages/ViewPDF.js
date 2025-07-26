
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ViewPDF = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedPdf, setSelectedPdf] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Load login status and PDF URL if redirected back from login
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    if (location.state?.pdfUrl) {
      console.log('PDF URL after login:', location.state.pdfUrl);  // Debug ke liye
      setSelectedPdf(location.state.pdfUrl);
    }
  }, [location]);

  const handleInputChange = (e) => setSearchQuery(e.target.value);

  const searchBooks = async () => {
    if (!searchQuery) {
      setMessage('Please enter a title or author name.');
      return;
    }

    setMessage('');
    setSearchResults([]);

    try {
      const response = await fetch(`https://final-year-project-api-ten.vercel.app/api/view-pdf?title=${searchQuery}&authorName=${searchQuery}`);
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'An error occurred while searching.');
        return;
      }

      if (data.message) {
        setMessage(data.message);
      } else {
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setMessage('An unexpected error occurred. Please try again later.');
    }
  };

  const handleViewPDF = (pdfUrl) => {
    if (!isLoggedIn) {
      // Redirect to login page and pass pdfUrl
      navigate('/api/login', { state: { pdfUrl } });
    } else {
      setSelectedPdf(pdfUrl);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Search & View Books</h2>

      {!selectedPdf && (
        <>
          <div style={styles.formGroup}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search by Title or Author Name"
              style={styles.input}
            />
            <button onClick={searchBooks} style={styles.button}>Search</button>
          </div>

          {message && <p style={styles.message}>{message}</p>}

          {searchResults.length > 0 && (
            <div style={styles.resultsContainer}>
              <h3>Search Results:</h3>
              <ul style={styles.resultList}>
                {searchResults.map((book) => (
                  <li key={book._id} style={styles.resultItem}>
                    <strong>{book.title}</strong> by {book.authorName}
                    <button onClick={() => handleViewPDF(book.pdfUrl)} style={styles.viewButton}>
                      View PDF
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {selectedPdf && (
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(selectedPdf)}&embedded=true`}
          title="PDF Viewer"
          style={styles.pdfViewer}
        />
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '700px', margin: '40px auto', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', fontFamily: 'Arial, sans-serif', textAlign: 'center' },
  heading: { color: '#333', marginBottom: '20px' },
  formGroup: { display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' },
  input: { width: '70%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', marginRight: '10px' },
  button: { backgroundColor: 'green', color: '#fff', padding: '10px 15px', fontSize: '16px', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  resultsContainer: { marginTop: '20px', textAlign: 'left' },
  resultList: { listStyleType: 'none', padding: '0' },
  resultItem: { backgroundColor: '#f8f8f8', padding: '10px', marginBottom: '10px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  viewButton: { backgroundColor: '#28a745', color: '#fff', padding: '5px 10px', fontSize: '14px', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  message: { color: 'red', fontWeight: 'bold' },
  pdfViewer: { width: '100%', height: '500px', border: '1px solid #ccc', marginTop: '20px' },
};

export default ViewPDF;
