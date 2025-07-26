const express = require('express');
const { getUserNotifications, markNotificationRead } = require('../Controllers/pcRequestController');

const router = express.Router();

router.get('/pcnotification', getUserNotifications);
router.post('/notifications/read', markNotificationRead);

module.exports = router;
