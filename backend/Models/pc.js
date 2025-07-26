const mongoose = require('mongoose');

const PcSchema = new mongoose.Schema({
    pc_Number: {
        type: Number,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true
    },
    reserved: {
        type: Boolean,
        default: false
    },
    reservedTime: {
        type: Number, // Store time in minutes
        default: 0
    }
});

const PcModel = mongoose.model('Pcs', PcSchema);

module.exports = PcModel;
