
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeaturesOptions, setShowFeaturesOptions] = useState(false); // State to toggle feature options
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search-books?query=${searchQuery}`);
  };

  const toggleDropdown = () => {
    setShowFeaturesOptions(!showFeaturesOptions); // Toggle feature options on click
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1>Abasyn Online Information Resource Center</h1>
        <nav className="nav">
          <a href="/home">Home</a>
          <button className="dropdown-button" onClick={toggleDropdown}>
            Services {showFeaturesOptions ? '▲' :  '▼' } {/* Dropdown indicator */}
          </button>
          <a href="/aboutus">About</a>
          <a href="/contactus">Contact Us</a>
          <a href="/api/signup">Sign Up</a>
          <a href="/api/login">Login</a>
        </nav>
        {/* Conditionally render the options under Features */}
        {showFeaturesOptions && (
          <div className="features-options">
            <a href="/getUserViewPcs">PC Reservation</a>
            <a href="/viewpdf">Softbook</a>
          </div>
        )}
      </header>

      <main className="main-content">
        <h2>Welcome to the Library</h2>
        <input
          type="text"
          placeholder="Search by Title or Author"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </main>

      <footer className="footer">
        <div className="social-media">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
        <p>&copy; 2024 Library System. All rights reserved.</p>
      </footer>
      <style jsx>{`
        /* Resetting box model for better consistency */
 
html, body {
  width:100vw;
  height: 100vh;
  mergin : 0;
  padding : 0;
  overflow: hidden;
  font-family: 'Arial', sans-serif;
}

.home-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
   /* Ensure it fills the viewport height */
  background: linear-gradient(to right, #f0f8ff, #d9eaf7); /* Smooth background gradient */
   background-image: url('/images/home1.13.jpg');  /* Path relative to the public folder */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}


.header {
  background-color:rgb(16, 56, 19); /* Deep blue background */
  color: white;
  width: 100%;
  padding: 10px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(242, 247, 243, 0.91);
}

.nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: 15px;
}

.nav a, .dropdown-button {
  color: white;
  text-decoration: none;
  padding: 12px 20px;
  font-size: 1em;
  border-radius: 4px;
  background: none;
  border: none;          
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  line-height: 1; /* Ensures all items have the same height */
  display: inline-flex; /* Keeps button text vertically centered */
  align-items: center; /* Vertical centering for button text */
  height: 40px;
}

.nav a:hover, .dropdown-button:hover {
  background-color:rgb(9, 112, 35);
  color: #fff;
}

.main-content {
  flex-grow: 1; /* Ensure it takes up remaining space */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
}

h2 {
  font-size: 4em;
  margin-bottom: 30px;
  color:  black;
}

.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-bar {
  width: 100%;
  max-width: 500px;
  padding: 12px;
  margin-bottom: 20px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1.1em;
  transition: border-color 0.3s ease;
}

.search-bar:focus {
  outline: none;
  border-color:rgb(12, 90, 60);
}

.search-button {
  padding: 12px 25px;
  background-color:rgb(21, 133, 40);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color:rgb(4, 58, 25);
}

.footer {
  background-color: #333;
  color: white;
  width:100%;
   min-width: unset;
  padding: 2px;
  text-align: center;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
}

.social-media {
  margin-bottom: 5px;
}

.social-media a {
  color: white;
  text-decoration: right;
  margin: 0 5px;
  font-size: 1em;
}

.social-media a:hover {
  color:rgb(26, 30, 219);
}

.features-options {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.features-options a {
  color:rgb(247, 249, 252);
  text-decoration: none;
  padding: 3px 16px;
  border: 1px solidrgb(14, 126, 42);
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.features-options a:hover {
  background-color:rgb(12, 73, 4);
  color: white;
}

@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    gap: 10px;
  }

  .search-bar {
    width: 90%;
  }

  .search-button {
    width: 90%;
  }
}

@media (max-width: 480px) {
  h2 {
    font-size: 1.6em;
  }

  .nav a {
    font-size: 0.9em;
  }
}


      `}</style>
    </div>
  );
}

export default Home;