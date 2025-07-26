const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({

    Title: { 
        type: String, 
        required: true 
    },
    Subtitle: String,
    StatementResponsibility: String,
    Author: { 
        type: String, 
        required: true 
    },
    Subauthor: String,
    Type: String,
    AccNo: {
        type: Number,
        unique: true,
        required: true,
    },
    Price: Number,
    EntryDate: Date,
    DDC_No: String,
    AUTH_Mark: String,
    Section: String,
    Reference: Boolean,
    Publisher: String,
    Place: String,
    Year : Number,
    Source : String,
    Edition: String,
    Volume: String,
    Pages: Number,
    Series: String,
    Language: String,
    Quantity: {
        type: Number,
        required: true,
    },
    ISBN: Number,
    Binding: String,
    Status: { type : String, 
        enum: ['Available', 'Borrowed', 'Reserved'], 
        default: 'Available', 
        required: true, 
    },
    Remarks : String,
    Contents : String,
    Notes: String,
    Subject: String,
    keyword: String,
});

const Book = mongoose.model('Books', bookSchema);

module.exports = Book;