const express = require('express');
const router = express.Router();
const { getNotifications, deleteNotification } = require('../Controllers/notificationController');

router.get('/', getNotifications);

router.delete('/:id', deleteNotification);

module.exports = router;
