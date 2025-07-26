const NotificationModel = require('../Models/notification');

// Fetch Notifications for the Logged-In User
const getNotifications = async (req, res) => {
  const userId = req.session.user?.id; // Assuming user session is stored in req.session

  if (!userId) {
    return res.status(401).json({ message: 'User not logged in' });
  }

  try {
    const notifications = await NotificationModel.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Create Notification (For Librarian to Notify User)
const createNotification = async (userId, message) => {
  try {
    if (!userId) {
      throw new Error('User ID is required for creating a notification');
  }
    const notification = new NotificationModel({ 
      user: userId, 
      message: message, 
      read: false,
    });
    await notification.save();
    console.log('Notification created successfully:', notification);
  } catch (error) {
    console.error('Error creating notification:', error.message);
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await NotificationModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Error deleting notification', error });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  deleteNotification,
};
