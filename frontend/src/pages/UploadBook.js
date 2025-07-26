
import React, { useState } from 'react';

const UploadBook = () => {
  const [pdf, setPdf] = useState(null);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [edition, setEdition] = useState('');
  const [place, setPlace] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleFileChange = (e) => setPdf(e.target.files[0]);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);
  const handleEditionChange = (e) => setEdition(e.target.value);
  const handlePlaceChange = (e) => setPlace(e.target.value);
  const handleAuthorNameChange = (e) => setAuthorName(e.target.value);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdf || !title) {
      setMessage('Please provide a title and a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', pdf);
    formData.append('title', title);
    formData.append('year', year);
    formData.append('edition', edition);
    formData.append('place', place);
    formData.append('authorName', authorName);

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error ${response.status}: ${
            response.headers.get('Content-Type')?.includes('application/json')
              ? JSON.parse(errorText).message
              : errorText
          }`
        );
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.error('Upload Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Upload Book</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Book Title</label>
          <input type="text" value={title} onChange={handleTitleChange} style={styles.input} required />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Author Name</label>
          <input type="text" value={authorName} onChange={handleAuthorNameChange} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Year</label>
          <input type="text" value={year} onChange={handleYearChange} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Edition</label>
          <input type="text" value={edition} onChange={handleEditionChange} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Place</label>
          <input type="text" value={place} onChange={handlePlaceChange} style={styles.input} />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Select PDF</label>
          <input type="file" accept=".pdf" onChange={handleFileChange} style={styles.fileInput} required />
        </div>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Book'}
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

// Internal CSS styles
const styles = {

  container: {
    maxWidth: '500px',
    margin: '40px auto',
    padding: '20px',
    borderRadius: '8px',
    // backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    // backgroundImage: 'url("/images/home1.9.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
    color: 'black',
  },
  input: {
    width: '100%',
    padding: '10px',

    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  fileInput: {
    width: '100%',
    padding: '10px',
    color: 'black',
    backgroundColor: 'none',
    fontSize: '14px',
  },
  button: {
    backgroundColor: 'seagreen',
    color: '#fff',
    padding: '10px 15px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  buttonHover: {
    backgroundColor: 'darkgreen',
  },
  message: {
    textAlign: 'center',
    marginTop: '15px',
    fontWeight: 'bold',
    color: 'green',
  },
};

export default UploadBook;
