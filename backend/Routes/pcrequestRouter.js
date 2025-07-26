const express = require('express');
const {
    createPcRequest,
    getAllPcRequests,
    updatePcRequestStatus,
    deleterequest,
} = require('../Controllers/pcRequestController');

const router = express.Router();

router.post('/create', createPcRequest);

router.get('/requests', getAllPcRequests);

router.post('/status', updatePcRequestStatus);

router.delete('/requests/:requestId', deleterequest);

router.get('/check-session', (req, res) => {
    if (req.session && req.session.user) {  // Assuming you're using sessions
      res.json({ user: req.session.user });
    } else {
      res.json({ user: null });
    }
  });

module.exports = router;
