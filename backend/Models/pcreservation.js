const mongoose = require('mongoose');

const PcRequestSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: true 
    },
    pc: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Pcs', 
        required: true 
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'reserved'],  // status can be pending, approved, or reserved
        default: 'pending'
    }, // Pending, Approved, Rejected
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    reservedUntil: { // New field added for reservation end time
        type: Date,
        required: false, // It will only be set when a request is approved or reserved
    },
});

module.exports = mongoose.model('PcRequest', PcRequestSchema);
