const express = require('express');
const router = express.Router();
// const authMiddleware = require('../Middlewares/authMiddleware');
const { registerUser, loginUser } = require('../Controllers/authController');

const { logoutUser } = require('../Controllers/logoutController');

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login-user', loginUser);

router.post('/logout', logoutUser);

module.exports = router;
