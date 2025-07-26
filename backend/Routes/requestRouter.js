const express = require('express');
const {
    createRequest,
    getPendingRequests,
    reviewRequest,
} = require('../Controllers/requestController');

// const router = express.Router();
module.exports = (io) => {
    const router = express.Router();

    // Pass io to the controller via req
    // const createRequestWithIO = (req, res) => createRequest(req, res, io);
    const reviewRequestWithIO = (req, res) => reviewRequest(req, res, io);


router.post('/', (req, res) => {
    createRequest(req, res, io);  // Pass io to the controller
});
// GET: Get all pending requests (For Librarian)
router.get('/pending', getPendingRequests);

// POST: Review request (Approve/Decline)
router.post('/review', reviewRequestWithIO);

return router;
};