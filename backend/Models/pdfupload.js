const mongoose = require('mongoose');

const pdfUploadSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    subtitle: String,
    year: { 
        type: Number, 
        required: true 
    },
    edition: String,
    place: String,
    authorName: { 
        type: String, 
        required: true 
    },
    pdfUrl: { 
        type: String, 
        required: true // Ensure the file URL is mandatory
    },
    uploadedAt: { 
        type: Date, 
        default: Date.now // Automatically sets the upload timestamp
    },
});

const PdfUpload = mongoose.model('PdfUploads', pdfUploadSchema);

module.exports = PdfUpload;
