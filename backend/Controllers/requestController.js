const mongoose = require('mongoose');
const  Borrow = require('../Models/borrow')
const RequestModel = require('../Models/requestmodel');
const BookModel = require('../Models/book');
const { createNotification } = require('../Controllers/notificationController');
const { io } = require('../index');
console.log('IO in requestController:', io);


const createRequest = async (req, res, io) => {
    const { bookId, type } = req.body;
    const userId = req.session.user?.id;
    console.log('Creating request for bookId:', bookId, 'type:', type, 'userId:', userId);

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    if (!io) {
        console.error('Socket.IO instance is undefined.');
        return res.status(500).json({ message: 'Socket.IO not initialized.' });
    }

    try {
        const book = await BookModel.findById(bookId);
        console.log('Found book:', book);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check for existing pending request
        const existingRequest = await RequestModel.findOne({ user: userId, book: bookId, status: 'pending' });
        if (existingRequest) {
            return res.status(400).json({ message: 'Request already pending for this book' });
        }

        // Create the request for either borrow or reserve
        const request = new RequestModel({
            user: userId,
            book: bookId,
            type: type, // either 'borrow' or 'reserve'
            status: 'pending', // Initially set as pending until admin action
            createdAt: Date.now(),
        });

        await request.save(); // Save the request

        // Emit event to notify librarian or system about the request
        io.emit('newRequest', {
            message: `${req.session.user.username} has requested to ${type} the book "${book.Title}".`
        });

        res.status(201).json({ message: 'Request sent successfully', request });
    } catch (error) {
        console.error('Error in createRequest:', error.message);
        res.status(500).json({ message: 'Error creating request', error: error.message });
    }
};

// Fetch Pending Requests (For Librarian)
const getPendingRequests = async (req, res) => {
    try {
        const requests = await RequestModel.find({ status: 'pending' })
            .populate('user', 'username email') // Populate user details
            .populate('book', 'Title Author');  // Populate book details
        res.status(200).json({ requests });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests', error: error.message });
    }
};

const reviewRequest = async (req, res) => {
    const { requestId, action } = req.body;

    try {
        const request = await RequestModel.findById(requestId)
                .populate('user', 'username email role') // Populate the user field with role
                .populate('book', 'Title Author Quantity Status'); // Populate the book field

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Request already reviewed' });
        }

        // Handle approve/decline actions
        if (action === 'approve') {
            if (request.type === 'borrow') {
                if (request.book.Quantity <= 0) {
                    return res.status(400).json({ message: 'Book is currently not available for borrowing. Status: Borrowed' });
                }
                
                // Borrow request: Decrease quantity and approve
                request.book.Quantity -= 1;  // Only decrease once here
                request.book.Status = 'Available'; // Change status to borrowed
                await request.book.save();

                // Set borrow duration based on user role (14 days for students, 90 days for faculty)
                let borrowDuration = 14;  // Default for students
                if (request.user.role === 'faculty') {
                    borrowDuration = 90;  // 90 days for faculty
                }

                // Calculate due date based on borrow duration
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + borrowDuration);

                // Create a new borrow entry
                const borrow = new Borrow({
                    user: request.user._id,
                    book: request.book._id,
                    borrowDate: Date.now(),
                    dueDate: dueDate,  // Use the calculated due date
                    status: 'borrowed',
                });

                await borrow.save();
                request.status = 'approved';  // Approve the request
            } else if (request.type === 'reserve') {
                // Reserve request: Approve without changing quantity
                request.status = 'approved';
            } else {
                return res.status(400).json({ message: 'Invalid request type.' });
            }
        } else {
            request.status = 'declined';  // Decline the request
        }

        await request.save();

        // Notify the user
        const userMessage = `Your ${request.type} request for "${request.book.Title}" has been ${request.status}.`;
        await createNotification(request.user._id, userMessage);

        res.status(200).json({ message: `Request ${action}d successfully`, request });
    } catch (error) {
        res.status(500).json({ message: 'Error reviewing request', error: error.message });
    }
};

module.exports = {
    createRequest,
    getPendingRequests,
    reviewRequest,
};
