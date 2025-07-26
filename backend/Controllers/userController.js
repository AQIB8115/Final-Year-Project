
const UserModel = require('../Models/user');
// const BorrowHistory = require('../Models/borrowhistory');
const bcrypt = require('bcrypt');
// const redis = require('redis');
// const client = redis.createClient();
const { redisClient, wss } = require('../redisSetup'); // Import Redis and WebSocket instances
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect();

// Signup controller
exports.signup = async (req, res) => {
    const { username, email, password, phone, department, studentID, employeeId, role } = req.body;

    // Validate required fields
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Username, password, and role are required' });
    }

    try {
        // Log request body for debugging
        console.log('Request Body:', req.body);

        // Construct the query dynamically based on the role
        let query = [];
        if (role === 'student') {
            query.push({ studentID });
        } else if (role === 'faculty' || role === 'librarian') {
            if (email) query.push({ email });
            if (employeeId) query.push({ employeeId });
        }

        // Check if user already exists
        if (query.length > 0) {
            let existingUser = await UserModel.findOne({ $or: query });
            if (existingUser) {
                return res.status(400).json({ message: 'User with this email or ID already exists' });
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user based on role
        const newUser = new UserModel({
            username,
            email: role === 'student' ? undefined : email,
            password: hashedPassword,
            phone,
            department: role === 'student' ? department : undefined,
            studentID: role === 'student' ? studentID : undefined,
            employeeId: role !== 'student' ? employeeId : undefined,
            role
        });

        // Save the new user to the database
        await newUser.save();

        // Cache user in Redis if Redis is connected
        if (redisClient.isOpen) {
            await redisClient.set(
                `user:${newUser._id}`,
                JSON.stringify(newUser),
                { EX: 24 * 60 * 60 } // Expires in 1 day
            );
        } else {
            console.error('Redis client not connected. Skipping cache.');
        }

        // Set session for the newly created user
        req.session.user = {
            id: newUser._id,
            username: newUser.username,
            role: newUser.role,
            email: newUser.email
        };

        // Optionally set a cookie with session ID
        res.cookie('session_id', req.sessionID, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // Cookie expires in 1 day
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser
        });

    } catch (error) {
        console.error('Error during signup:', error.message, error.stack);
        res.status(500).json({ message: 'Server error during signup', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { password, studentID, employeeId } = req.body;

    try {
        if (!redisClient.isOpen) await redisClient.connect();


        let query = {};

        const redisKey = studentID ? `user:${studentID}` : `user:${employeeId}`;
        if (studentID) {
            query.studentID = Number(studentID.trim());

        } else if (employeeId) {
            query.employeeId = employeeId.trim();

        } else {
            return res.status(400).json({ message: 'Please provide either studentID or employeeId' });
        }
        
        console.log('Query being sent to database:', query);
        // Check Redis cache
        let user = await redisClient.get(redisKey);
        if (!user) {
            console.log('User not found in Redis, querying database...');
            user = await UserModel.findOne(query);
            console.log('User found in database:', user);
            if (!user) return res.status(404).json({ message: 'User not found' });

            // Cache the user
            await redisClient.set(redisKey, JSON.stringify(user), { EX: 24 * 60 * 60 });
            console.log('User cached in Redis:', user);
        } else {
            user = JSON.parse(user);
            console.log('User found in Redis:', user);
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        // Session and response
        req.session.user = {
            id: user._id,
            username: user.username,
            role: user.role,
            email: user.email,
        };
        res.cookie('session_id', req.sessionID, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                username: user.username,
                role: user.role,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message || error });
    }
};

// // Controller to get a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
};

// // Controller to delete a user by ID
exports.deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const user = await UserModel.find();
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};
exports.addUser = async (req, res) => {
    console.log('Session Data:', req.session);

    if (!req.session.user) {
        return res.status(401).send({ message: 'Unauthorized: No session found' });
      }
    const { username, email, password, phone, department, role, studentID, employeeId } = req.body;

    // Check if the user is admin or librarian (this should be checked from session or token)
    if (req.session.user.role !== 'superadmin' && req.session.user.role !== 'admin') {
        // return res.status(403).send({ message: 'Forbidden: Access denied' });
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user object based on role
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            phone,
            department,
            role,
            studentID: role === 'student' ? studentID : undefined,
            employeeId: role === 'faculty' || role === 'librarian' ? employeeId : undefined
        });

        // Save the new user
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Failed to add user' });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
      // Check if the user is logged in through session
      if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      // Fetch the user profile from the database using the userId stored in session
      const user = await UserModel.findById(req.session.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Send the profile data excluding the password
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching profile data', error: err.message });
    }
  };
  
// module.exports = {
    // getBorrowedBooks,
//     addUser,
// }