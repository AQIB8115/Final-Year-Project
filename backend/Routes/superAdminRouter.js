const express = require('express');
const router = express.Router();

const { initializeSuperAdmin } = require('../Controllers/superAdminController');
// Apne controller ka path yahan daalein
const { loginSuperAdmin } = require('../Controllers/superAdminController');

router.get('/initialize-superadmin', async (req, res) => {
    try {
        await initializeSuperAdmin();
        res.status(200).send('SuperAdmin account initialization completed.');
    } catch (error) {
        res.status(500).send('Error initializing SuperAdmin: ' + error.message);
    }
});
router.post('/login-superadmin', loginSuperAdmin);

module.exports = router;