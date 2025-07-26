const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books',
        required: true,
    },
    type: {
        type: String,
        enum: ['borrow', 'reserve'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const RequestModel = mongoose.model('Requests', RequestSchema);
module.exports = RequestModel;
