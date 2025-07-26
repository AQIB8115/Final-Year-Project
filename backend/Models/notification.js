const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users', 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  read: { 
    type: Boolean, 
    default: false 
  }, // For marking notifications as read/unread
  
});

module.exports = mongoose.model('Notification', NotificationSchema);
