const express = require('express');
const router = express.Router();
const { signup, login, getUserById, deleteUser, getAllUsers, addUser, getProfile } = require('../Controllers/userController');

const { isAdmin } = require('../Middlewares/authMiddleware');
// POST request to handle user signup
router.post('/signup', signup);

// POST request to handle user login
router.post('/login', login);

// Route to get all users
router.get('/users', getAllUsers);

// Route to get a single user by ID
router.get('/users/:id', getUserById);

// Route to delete a user by ID
router.delete('/users/:id', deleteUser);

router.post('/newuser', isAdmin, addUser);


router.get('/profile', getProfile);

router.post('/register', isAdmin, async (req, res) => {
    res.status(200).json({ message: 'Access granted. Admin verified.' });
});

module.exports = router;