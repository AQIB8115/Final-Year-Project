// routes/bookRoutes.js
const express = require('express');
const { reserveBook, borrowBook, borrow, returnBook, getAllBorrowedBooks,  } = require('../Controllers/borrowController');
const router = express.Router();

// Reserve book route
router.post('/reserve-book/:bookId', reserveBook);

// Borrow book route
router.post('/borrow-book/:bookId', borrowBook);

router.post('/borrow', borrow);

// Route for admin to get all borrowed books for a user
router.get('/all', getAllBorrowedBooks);

// router.get('/my-borrowed-books', getUserBorrowedBooks);

// Return a book
router.put('/return/:borrowId',  returnBook);

module.exports = router;
