const Book = require('../Models/book');
const UserModel = require('../Models/user');
const { redisClient } = require('../redisSetup');

exports.createBook = async (req, res) => {
    try {
        const { 
            Title, Subtitle, StatementResponsibility, Author, Subauthor, Type, AccNo, Price, EntryDate, DDC_No, AUTH_Mark, 
            Section, Reference, Publisher, Place, Year, Source, Edition, Volume, Pages, Series, Language, Quantity, 
            ISBN, Binding, Status, Remarks, Contents, Notes, Subject, keyword 
        } = req.body;

        const newBook = new Book({
            Title, Subtitle, StatementResponsibility, Author, Subauthor, Type, AccNo, Price, EntryDate, DDC_No, AUTH_Mark, 
            Section, Reference, Publisher, Place, Year, Source, Edition, Volume, Pages, Series, Language, Quantity, 
            ISBN, Binding, Status, Remarks, Contents, Notes, Subject, keyword
        });

        await newBook.save();

        res.status(201).json({ message: 'Book created successfully', book: newBook });
    } catch (error) {
        res.status(500).json({ message: 'Error creating book', error });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book updated successfully', book: updatedBook });
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Error updating book' });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Error deleting book' });
    }
};

const fetchBookDetails = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/books'); // Adjust the endpoint if necessary
        console.log(response.data); // Check if you are getting the correct data
    } catch (error) {
        console.error('Error fetching book details:', error);
    }
};

exports.module = fetchBookDetails;


exports.getBooks = async (req, res) => {
    const searchQuery = req.query.search || ''; // Default to empty if no search query

    try {
        const cacheKey = `books:${searchQuery}`;
        const cachedBooks = await redisClient.get(cacheKey);

        if (cachedBooks) {
            console.log('Returning books from cache');
            return res.json(JSON.parse(cachedBooks));
        }

        const books = await Book.find({
            $or: [
                { Title: { $regex: searchQuery, $options: 'i' } },
                { Author: { $regex: searchQuery, $options: 'i' } },
                { keyword: { $regex: searchQuery, $options: 'i' } },
            ],
        });

        // Cache the results in Redis for 10 minutes
        await redisClient.set(cacheKey, JSON.stringify(books), { EX: 600 });

        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Error fetching books' });
    }
};

// Get Book and User data after login
exports.getBookData = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ msg: 'Book not found' });

        const user = await UserModel.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role,
                department: user.department,
                studentID: user.studentID,
                employeeId: user.employeeId
            },
            book: {
                title: book.Title,
                author: book.Author,
                publisher: book.Publisher,
                price: book.Price,
                quantity: book.Quantity,
                isbn: book.ISBN,
                status: book.Status
            }
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};
