

const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: true 
    },
    book: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Books', 
        required: true 
    },
    borrowDate: { 
        type: Date, 
        required: true 
    },
    dueDate: { 
        type: Date, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['borrowed', 'returned'], 
        default: 'borrowed' 
    },
});

module.exports = mongoose.model('Borrow', borrowSchema);
