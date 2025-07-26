const express = require('express');
const router = express.Router();
const bookController = require('../Controllers/bookController');
const { getBookData } = require('../Controllers/bookController');
const auth = require('../Middlewares/Auth');

// router.post('/createBook', bookController.createBook);
router.post('/books', bookController.createBook);
// router.get('/spineLabel/:id', bookController.getSpineLabel)
router.get('/books', bookController.getAllBooks);

router.get('/books/:id', bookController.getBookById);

router.put('/books/:id', bookController.updateBook);

router.delete('/books/:id', bookController.deleteBook);

// router.get('/books/:AccNo', bookController.getBookDetails);

router.get('/book', bookController.getBooks);

// Get book and user data after login
router.get('/book/:id', auth, getBookData);

module.exports = router;