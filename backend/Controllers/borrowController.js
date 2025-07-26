
// controllers/borrowController.js
const Book = require('../Models/book');
const User = require('../Models/user');
// const BorrowHistory = require('../Models/borrowhistory');
const Borrow = require('../Models/borrow')

// Reserve book
exports.reserveBook = async (req, res) => {
  const { bookId } = req.params;
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    const book = await Book.findById(bookId);

    if (!user || !book) {
      return res.status(400).json({ message: 'User or Book not found.' });
    }

    if (book.Status === 'reserved') {
      return res.status(400).json({ message: 'This book is already reserved.' });
    }

    book.Status = 'reserved';
    book.reservedBy = userId;
    await book.save();

    res.status(200).json({ message: 'Book successfully reserved.' });
  } catch (error) {
    res.status(500).json({ message: 'Error reserving book', error });
  }
};


exports.borrowBook = async (req, res) => {
  const { userId, bookId } = req.body;

  try {
      // Find the user and the book from the database
      const user = await User.findById(userId);
      const book = await Book.findById(bookId);

      if (!user || !book) {
          return res.status(404).json({ message: 'User or Book not found' });
      }

      // Check if the book is available or not
      if (book.Status === 'borrowed') {
          return res.status(200).json({ message: 'Book is currently borrowed', available: false });
      }

      if (book.Quantity <= 0) {
          return res.status(200).json({ message: 'No available copies to borrow', available: false });
      }

      // Book is available
      res.status(200).json({
          message: 'Book is available for borrowing',
          available: true,
          book: {
              title: book.Title,
              author: book.Author,
              quantity: book.Quantity,
          },
      });
  } catch (error) {
      res.status(500).json({ message: 'Error checking book availability', error: error.message });
  }
};


exports.borrow = async (req, res) => {
  const { userId, bookId } = req.body;

  try {
      // Find the user and the book from the database
      const user = await User.findById(userId);
      const book = await Book.findById(bookId);

      if (!user || !book) {
          return res.status(404).json({ message: 'User or Book not found' });
      }

      // Check if the book is available
      if (book.Status === 'borrowed') {
          return res.status(400).json({ 
              message: 'Book is already borrowed. You can reserve the book instead.' 
          });
      }

      // Check if the book has available quantity
      if (book.Quantity > 0) {
          // Set the borrow duration based on the user's role
          let borrowDuration;
          if (user.role === 'student') {
              borrowDuration = 14;  // 14 days for students
          } else if (user.role === 'faculty') {
              borrowDuration = 90;  // 3 months for faculty (90 days)
          } else {
              return res.status(400).json({ message: 'Invalid user role' });
          }

          // Calculate the due date based on the borrow duration
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + borrowDuration);

          // Create the Borrow entry in the Borrow model
          const borrowEntry = new Borrow({
              user: userId,
              book: bookId,
              borrowDate: new Date(),  // Set the borrow date to current date
              dueDate: dueDate,  // Use the calculated due date
              status: 'borrowed',  // Status is 'borrowed' when the book is lent out
          });

          await borrowEntry.save(); // Save the borrow entry

          // Decrease the book quantity
          book.Quantity -= 1;
          await book.save(); // Save the updated book data

          // Return success response with borrow details
          return res.status(201).json({
              message: 'Book borrowed successfully.',
              borrowEntry: borrowEntry,  // Return the borrow entry in the response
              bookDetails: {
                  title: book.Title,
                  quantity: book.Quantity,
                  dueDate: dueDate,
              }
          });
      } else {
          return res.status(400).json({ 
              message: 'Book is currently unavailable for borrowing. You can reserve the book instead.' 
          });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error borrowing book', error: error.message });
  }
};

exports.returnBook = async (req, res) => {
  const { borrowId } = req.params; // Use req.params instead of req.body

  try {
    // Find the borrow entry
    const borrow = await Borrow.findById(borrowId);

    if (!borrow || borrow.status !== 'borrowed') {
      return res.status(400).json({ message: 'This book is not currently borrowed.' });
    }

    // Calculate the fine if the book is returned late
    const currentDate = new Date();
    const dueDate = new Date(borrow.dueDate);
    const finePerDay = 100; // Fine per day
    let fine = 0;

    if (currentDate > dueDate) {
      const diffInTime = currentDate - dueDate;
      const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24)); // Calculate difference in days
      fine = diffInDays * finePerDay;
    }

    // Update the borrow status to returned
    borrow.status = 'returned';
    borrow.returnDate = currentDate;
    borrow.fine = fine; // Store the fine in the borrow record
    await borrow.save();

    // Update the book quantity
    const book = await Book.findById(borrow.book);
    book.Quantity += 1;

    // Update the book's status to available if quantity is greater than 0
    if (book.Quantity > 0) {
      book.Status = 'Available';
    }

    await book.save();

    // Respond with success message including fine details
    res.status(200).json({
      message: 'Book returned successfully.',
      fine: fine > 0 ? `₹${fine}` : 'No fine',
      bookDetails: {
        title: book.Title,
        quantity: book.Quantity,
        status: book.Status,
      },
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Error processing return request', error });
  }
};


exports.getAllBorrowedBooks = async (req, res) => {
    try {
        // Fetch all borrow records and populate the user and book details
        const borrowedBooks = await Borrow.find({ status: 'borrowed' })
            .populate('user', 'username email role studentID employeeId')  // Populate the user details (username, email, role)
            .populate('book', 'Title Author')  // Populate the book details (Title, Author)
            .exec();

        if (!borrowedBooks || borrowedBooks.length === 0) {
            return res.status(404).json({ message: 'No borrowed books found' });
        }
          // Add a custom ID based on the user's role
          const formattedBooks = borrowedBooks.map(borrow => {
          const user = borrow.user;
          if (!user) {
            return {
              ...borrow._doc,
              user: {
                customID: 'N/A',  // Default value if user is null
                role: 'N/A',  // Default role if user is null
              },
            };
          }
          const customID = user.role === 'student' ? user.studentID : user.employeeId;
        
          return {
              ...borrow._doc,
              user: {
                  ...user._doc,
                  customID, // Add a dynamic customID field
              },
          };
        });
        // Return the borrowed books along with user and book details
        res.status(200).json({
            message: 'All borrowed books retrieved successfully',
            borrowedBooks: formattedBooks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving borrowed books', error: error.message });
    }
};


