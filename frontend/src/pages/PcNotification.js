import React, { useEffect, useState } from 'react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('https://final-year-project-api-ten.vercel.app/api/notifications', {
                    credentials: 'include', // Include cookies for user session
                });
                const data = await response.json();
                setNotifications(data.notifications);
            } catch (err) {
                console.error('Failed to fetch notifications:', err);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="notifications">
            <h3>Notifications</h3>
            <ul>
                {notifications.map((notif) => (
                    <li key={notif._id} className={notif.read ? 'read' : 'unread'}>
                        {notif.message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;
