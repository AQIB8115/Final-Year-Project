import React, { useEffect, useState } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notifications', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleRemoveNotification = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification._id !== id)
        );
      } else {
        console.error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="header">Notifications</h2>
      {notifications.map((notification) => (
        <div key={notification._id} className="notification">
          <p className="text">{notification.message}</p>
          <button className="button" onClick={() => handleRemoveNotification(notification._id)}>
            OK
          </button>
        </div>
      ))}
      <style jsx>{`
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
        .container {
          padding: 50px;
          {/* background-color: darkgreen; */}
          border: 1px solid #e2e2e8;
          border-radius: 12px;
          height: 100vh;
          max-width: 600px;
          margin: 20px auto;
          {/* font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; */}
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .header {
          margin-bottom: 10px;
          height: 10vh;
          font-size: 24px;
          font-weight: 600;
          color: black;
          text-align: center;
        }
        .notification {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 10vh;
          width: 100%;
          background-color: lightgreen;
          border: 1px solid #e0e0e0;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
          flex-wrap: wrap;
        }
        .text {
          margin: 0;
          font-size: 16px;
          color: #444;
          line-height: 1.5;
          word-wrap: break-word;
          flex: 1;
        }
        .button {
          background-color:rgb(16, 114, 16);
          color: #fff;
          border: none;
          border-radius: 5px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }
        .button:hover {
          background-color:rgb(11, 78, 41);
        }
      `}</style>
    </div>
  );
};

export default Notifications;