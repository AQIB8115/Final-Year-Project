// Hardcoded SuperAdmin Creation
const UserModel = require('../Models/user');
const bcrypt = require('bcrypt');

const createSuperAdmin = async () => {
    const superAdmin = await UserModel.findOne({ username: 'admin' });

    if (!superAdmin) {
        const hashedPassword = await bcrypt.hash('Admin@123', 10); // Change this to a secure password
        const newSuperAdmin = new UserModel({
            username: 'admin',
            email: 'admin@gmail.com', // Optional, can be removed if not needed
            password: hashedPassword,
            phone: '03358552406', // Change to desired phone number
            role: 'superadmin'
        });

        await newSuperAdmin.save();
        console.log('SuperAdmin account created successfully.');
    } else {
        console.log('SuperAdmin account already exists.');
    }
};
const initializeSuperAdmin = async () => {
    await createSuperAdmin();
};

const loginSuperAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // const user = await UserModel.findOne({ username });
        const user = await UserModel.findOne({ username, role: 'superadmin' });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        req.session.user = {
            id: user._id,
            username: user.username,
            role: 'superadmin',
        };
        res.cookie('adminSession', req.sessionID, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: 'SuperAdmin login successful',
            user,
        });

    
    } catch (error) {
        console.error('Error during SuperAdmin login:', error);
        return res.status(500).json({ message: 'Error during login', error: error.message });
    }
};


module.exports = {
    initializeSuperAdmin,
    createSuperAdmin,
    loginSuperAdmin,
    // Other controller functions can go here
};