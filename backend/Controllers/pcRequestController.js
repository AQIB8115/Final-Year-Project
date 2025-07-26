const mongoose = require('mongoose');
const PcRequest = require('../Models/pcreservation');
const Notification = require('../Models/notification');
// const User = require('../models/');

exports.createPcRequest = async (req, res) => {
    console.log('Request body:', req.body); // Add this line
    const { userId, pcNumber, startTime, endTime } = req.body;

    if (!userId || !pcNumber || !startTime || !endTime) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        
        const request = new PcRequest({
            user: userId,
            pc: pcNumber, // Map pcNumber to the pc field in the schema
            startTime,
            endTime
        });
        
        await request.save();

        // io.emit('new-reservation-request', { userId, pcNumber, startTime, endTime });
        res.status(201).json({ message: 'Request created successfully', request });
    } catch (err) {
        console.error('Error saving PcRequest:', err); // Add this line
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};



// Update Request Status and Notify User
exports.getAllPcRequests = async (req, res) => {
    try {
        const requests = await PcRequest.find()
            .populate('user', 'studentID')
            .populate('pc', 'pc_Number') // Include PC details
            .sort({ createdAt: -1 })
            .exec();

            console.log('Populated requests:', requests);  
        res.status(200).json({ requests });
    } catch (err) {
        console.error('Error fetching requests:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.updatePcRequestStatus = async (req, res) => {
    const { requestId, status } = req.body;

    try {
        if (!requestId || !status) {
            console.error('Missing parameters:', { requestId, status });
            return res.status(400).json({ message: 'RequestId and status are required' });
        }

        // Find the request and update the status
        const request = await PcRequest.findByIdAndUpdate(
            requestId,
            { 
                status,
                reservedUntil: status === 'reserved' ? new Date(Date.now() + (120 * 60 * 1000)) : null // 120 minutes from now
            },
            { new: true }
        )
        .populate('user', 'studentID')
        .populate('pc', 'pc_Number');

        if (!request) {
            console.error('Request not found for ID:', requestId);
            return res.status(404).json({ message: 'Request not found' });
        }

        const user = request.user; // Populated user object
        if (user) {
            const notificationMessage = `Your PC reservation request for PC ${request.pc ? request.pc.PC_Number : 'Unknown'} has been ${status}.`;

            // Store notification in the database
            await Notification.create({
                user: user._id,
                message: notificationMessage,
                type: 'pc_request',
                read: false,
            });

            console.log(`Notification sent to ${user.studentID}: ${notificationMessage}`);
        }

        res.status(200).json({ message: 'Request status updated successfully', request });
    } catch (err) {
        console.error('Error updating request:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// notification controller
const PCNotification = require('../Models/pcnotification');
const UserModel = require('../Models/user');

// Assuming you are using express and fetching user notifications from a database
exports.getUserNotifications = async (req, res) => {
    try {
        // Assuming user data is fetched using a userId from the request
        const userId = req.userId; // Make sure userId is passed correctly in the request

        // Ensure userId is valid
        if (!userId) {
            return res.status(400).json({ message: 'User ID is missing' });
        }

        // Fetch the user from the database (use your actual method to fetch the user)
        const user = await UserModel.findById(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user object is valid and has the expected properties
        if (!user.id) {
            console.log("User object is missing the expected 'id' property");
            return res.status(400).json({ message: 'User ID is missing or invalid' });
        }

        // Assuming you are fetching notifications from a database or service
        const notifications = await PCNotification.find({ userId: user.id });

        // If no notifications, return a proper response
        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: 'No notifications found for this user' });
        }

        // Send the notifications back to the client
        return res.status(200).json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ message: 'An error occurred while fetching notifications' });
    }
};

exports.markNotificationRead = async (req, res) => {
    const { notificationId } = req.body;

    try {
        const notification = await PCNotification.findByIdAndUpdate(
            notificationId,
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (err) {
        console.error('Error marking notification as read:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
// Express route for deleting a request
exports.deleterequest = async (req, res) => {
    const { requestId } = req.params;
    try {
      const request = await PcRequest.findByIdAndDelete(requestId);
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }
      // Delete the request
    await request.deleteOne();
      res.status(200).json({ message: 'Request deleted successfully', request });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete request' , error: error.message});
    }
  };
  