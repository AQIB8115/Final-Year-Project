const express = require('express');
const router = express.Router();
const upload = require('../Config/cloudinaryConfig');
const PdfUpload = require('../Models/pdfupload'); // Updated model

// Upload PDF Route
router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    console.log('Request Headers:', req.headers);
    console.log('File:', req.file); // Check if file is received
    console.log('Body:', req.body);

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded!' });
    }

    try {
        const newPdfUpload = new PdfUpload({
            title: req.body.title,
            subtitle: req.body.subtitle || '', // Optional field
            year: req.body.year,
            edition: req.body.edition || '', // Optional field
            place: req.body.place || '', // Optional field
            authorName: req.body.authorName,
            pdfUrl: req.file.path, // Save the Cloudinary URL in the pdfUrl field
        });

        await newPdfUpload.save(); // Save the new PDF record to the database

        res.status(200).json({
            message: 'PDF uploaded successfully',
            fileUrl: req.file.path, // Return the uploaded file URL
        });
    } catch (error) {
        console.error('Error saving PDF:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/view-pdf', async (req, res) => {
    try {
        console.log(req.query); 
        const { title, authorName } = req.query;

        if (!title && !authorName) {
            return res.status(400).json({ message: 'Please provide a title or author name to search.' });
        }

        const query = {};
        if (title) query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
        if (authorName) query.authorName = { $regex: authorName, $options: 'i' };

        // const books = await PdfUpload.find(query);

        const books = await PdfUpload.find({ title: { $regex: 'dfdf', $options: 'i' } });
        console.log(books);

        if (books.length === 0) {
            return res.status(404).json({ message: 'No matching books found.' });
        }

        res.json(books);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
