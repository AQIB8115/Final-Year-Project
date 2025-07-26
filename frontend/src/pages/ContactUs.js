
import React from 'react';

function ContactUs() {
  return (
    <div className="contact-container">
      <header className="header">
        <h1>Abasyn Online Information Resource Center</h1>
        <nav className="nav">
          <a href="/home">Home</a>
          <button className="dropdown-button">
            Services ▼
          </button>
          <a href="/aboutus">About</a>
          <a href="/contactus">Contact Us</a>
          <a href="/api/signup">Sign Up</a>
          <a href="/api/login">Login</a>
        </nav>
      </header>

      <main className="main-content">
        {/* Blurred Container */}
        <div className="text-container">
          <h1>Contact Us</h1>
          <p>Reach us through the following details:</p>
          <h2>Library Address:</h2>
          <p>Abasyn University Islamabad Campus, Chakshazad</p>
          <h2>Library Hours:</h2>
          <p>Mon - Fri: 9 AM - 5 PM</p>
          <p>Sat - Sun: 10 AM - 4 PM</p>
          <h2>Contact:</h2>
          <p>📞 +92 312 3456789</p>
          <p>📧 library@abasyn.edu.pk</p>
        </div>
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
        /* General Reset and Styling */
        html, body {
          width: 100vw;
          height: 100vh;
          margin: 0;
          padding: 0;
          overflow: hidden;
          font-family: 'Arial', sans-serif;
        }

        .contact-container {
          display: flex;
          flex-direction: column;
          height: 100vh; /* Full height */
          width: 100vw; /* Full width */
          background: linear-gradient(to right, rgb(85, 209, 112), rgb(208, 212, 152));
          background-image: url('/images/home1.13.jpg');
          background-size: cover;
          background-position: center;
        }

        /* Header Styles */
        .header {
          background-color: rgb(16, 56, 19);
          color: white;
          text-align: center;
          padding: 10px 0;
          box-shadow: 0 4px 6px rgba(242, 247, 243, 0.91);
        }

        .header h1 {
          font-size: 2.5em;
          margin: 0;
        }

        /* Navigation Styles */
        .nav {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 4px;
          margin-top: 15px;
        }

        .nav a, .dropdown-button {
          color: white;
          padding: 10px 20px;
          font-size: 1.2em;
          text-decoration: none;
          transition: background-color 0.3s ease;
          border: none;
          background: none;
          cursor: pointer;
        }

        .nav a:hover, .dropdown-button:hover {
          background-color: rgb(4, 56, 17);
        }

        /* Main Content */
        .main-content {
          flex-grow: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          text-align: center;
        }

        /* Blurred Container */
        .text-container {
          background: rgba(255, 255, 255, 0.2); /* Semi-transparent white */
          backdrop-filter: blur(12px); /* Blurred background */
          padding: 20px;
          border-radius: 10px;
          max-width: 800px;
          width: 90%;
          text-align: center;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }

        .text-container h1 {
          font-size: 3em;
          color: rgb(8, 10, 8);
        }

        .text-container p {
          font-size: 1.3em;
          color: rgb(7, 6, 8);
          margin-top: 10px;
          line-height: 1.2;
          {/* font-weight: bold; */}
        }

        /* Footer Styles */
        .footer {
          background-color: #333;
          color: white;
          text-align: center;
          padding: 10px;
        }

        .social-media {
          margin-bottom: 10px;
        }

        .social-media a {
          color: white;
          text-decoration: none;
          margin: 0 10px;
        }

        .social-media a:hover {
          color: rgb(26, 30, 219);
        }

        /* Responsive Adjustments */
        @media (max-width: 1024px) {
          .nav {
            gap: 20px;
          }

          .text-container h1 {
            font-size: 2.5em;
          }

          .text-container p {
            font-size: 1.2em;
          }

          .nav a {
            font-size: 1.1em;
          }

          .dropdown-button {
            font-size: 1.1em;
          }
        }

        @media (max-width: 768px) {
          .nav {
            flex-direction: column;
            gap: 15px;
          }

          .text-container h1 {
            font-size: 2em;
          }

          .text-container p {
            font-size: 1em;
          }

          .nav a {
            font-size: 1em;
            padding: 10px;
          }

          .dropdown-button {
            font-size: 1em;
            padding: 8px 12px;
          }
        }

        @media (max-width: 480px) {
          .text-container h1 {
            font-size: 1.6em;
          }

          .nav a {
            font-size: 0.9em;
          }

          .text-container p {
            font-size: 0.9em;
          }

          .footer {
            font-size: 0.9em;
          }
        }
      `}</style>
    </div>
  );
}

export default ContactUs;
