import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ReserveTime = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [manualEndTime, setManualEndTime] = useState('');
  const [selectedTime, setSelectedTime] = useState('default');
  const [errorMessage, setErrorMessage] = useState('');
  const [isReserved, setIsReserved] = useState(false);

  useEffect(() => {
    const fetchReservationStatus = async () => {
      try {
        const response = await fetch(`https://final-year-project-api-ten.vercel.app/api/reservation-status/${id}`);
        const data = await response.json();
        if (data.status === 'reserved') {
          setIsReserved(true);
        }
      } catch (error) {
        console.error('Error fetching reservation status:', error);
      }
    };

    fetchReservationStatus();
  }, [id]);

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    setErrorMessage('');
    if (selectedTime === 'default') {
      const startDate = new Date(`1970-01-01T${e.target.value}:00`);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      const hours = endDate.getHours().toString().padStart(2, '0');
      const minutes = endDate.getMinutes().toString().padStart(2, '0');
      setEndTime(`${hours}:${minutes}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startTime) {
      setErrorMessage('Please select a start time.');
      return;
    }
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || userId === 'null' || !token) {
      navigate('/api/login', { state: { pcId: id, startTime, endTime }, replace: true });
      return;
    }

    const reservationDetails = {
      userId,
      pcNumber: id,
      startTime,
      endTime: selectedTime === 'manual' ? manualEndTime : endTime,
    };

    try {
      const response = await fetch('https://final-year-project-api-ten.vercel.app/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationDetails),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Reservation failed.');
      }

      alert('Reservation request submitted successfully!');
      setIsReserved(true);
      navigate('/student-dashboard');
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred.');
    }
  };

  return (
    <div className="container">
      <h2 className="title">Reserve PC</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="formGroup">
          <label className="label">Select Time Type:</label>
          <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="input">
            <option value="default">Default (1 hour)</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        <div className="formGroup">
          <label className="label">Start Time:</label>
          <input type="time" value={startTime} onChange={handleStartTimeChange} required className="input" />
        </div>
        {selectedTime === 'default' ? (
          <div className="formGroup">
            <label className="label">End Time:</label>
            <input type="time" value={endTime} disabled className="input" />
          </div>
        ) : (
          <div className="formGroup">
            <label className="label">Manual End Time:</label>
            <input type="time" value={manualEndTime} onChange={(e) => setManualEndTime(e.target.value)} required className="input" />
          </div>
        )}
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit" className={isReserved ? "disabledButton" : "button"} disabled={isReserved}>
          {isReserved ? 'Already Reserved' : 'Confirm Reservation'}
        </button>
      </form>
      <style jsx>{`
       
html, body {
  width:100vw;
  height: 100vh;
  mergin : 0;
  padding : 0;
  overflow: hidden;
    background: linear-gradient(to right, #f0f8ff, #d9eaf7); /* Smooth background gradient */
   background-image: url('/images/home1.5.jpg');  /* Path relative to the public folder */

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  font-family: 'Arial', sans-serif;
}

        .container {
          max-width: 100vh;
          margin: 50px auto;
          padding: 20px;
          background-color:rgb(230, 233, 230);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          font-family: Arial, sans-serif;
        }
        .title {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }
        .form {
          display: flex;
          flex-direction: column;
        }
        .formGroup {
          margin-bottom: 15px;
        }
        .label {
          margin-bottom: 5px;
          font-weight: bold;
          color: black;
        }
        .input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
        }
        .error {
          color: #d9534f;
          font-size: 14px;
          margin-top: 10px;
        }
        .button {
          padding: 12px;
          background-color: #28a745;
          color: white;
          font-size: 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 15px;
          transition: background-color 0.3s ease;
        }
        .disabledButton {
          padding: 12px;
          background-color: #6c757d;
          color: white;
          font-size: 16px;
          border: none;
          border-radius: 5px;
          cursor: not-allowed;
          margin-top: 15px;
        }
      `}</style>
    </div>
  );
};

export default ReserveTime;
