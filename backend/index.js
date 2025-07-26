
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { RedisStore } = require('connect-redis');
const { redisClient } = require('./redisSetup.js');
const cors = require('cors');
require('dotenv').config();

require('./Models/db'); // Connect to the database

const http = require('http');
const socketIO = require('socket.io');

const userRouter = require('./Routes/userRouter');
const superAdminRouter = require('./Routes/superAdminRouter');
const bookRouter = require('./Routes/bookRouter');
const pcRouter = require('./Routes/pcRouter.js');
const pcrequestRouter = require("./Routes/pcrequestRouter.js");
const borrowRouter = require('./Routes/borrowRouter');
const authRouter = require('./Routes/authRouter');
const requestRouter = require('./Routes/requestRouter.js');
const notificationRouter = require('./Routes/notificationRouter.js');
const pcnotificationRouter = require('./Routes/pcnotificationRouter.js');
const uploadRouter = require('./Routes/uploadRouter.js');

// Create Express app
const app = express();
const server = http.createServer(app); // Create the HTTP server

// Initialize Socket.IO on the server
const io = socketIO(server, {
    cors: {
        origin: "https://final-year-project-6jlw.vercel.app", // Adjust to your front-end URL
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true, // Allow credentials
    },
});

// Log to verify IO initialization
console.log('IO initialized:', io);

const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(cors({
    origin: 'https://final-year-project-6jlw.vercel.app', // Allow requests from frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow cookies and other credentials
}));

// Explicitly handle preflight OPTIONS requests
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://final-year-project-6jlw.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Content-Type', 'application/pdf');
    res.sendStatus(204); // No Content for OPTIONS requests
});

// Middleware: Body Parser
app.use(bodyParser.json());

// Middleware: Cookie Parser
app.use(cookieParser());

// Middleware: Session Management
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET, // Secret to sign session ID
    resave: false, // Do not save session if unmodified
    saveUninitialized: false, // Save new sessions even if unmodified
    cookie: {
        httpOnly: true, // Prevent JavaScript access to cookies
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
        sameSite: 'lax', // Use 'strict' for additional security in production
    }
}));

// Route Middleware
app.use('/api', userRouter);
app.use('/api/users', superAdminRouter);
app.use('/api', bookRouter);
app.use('/api', pcRouter);
app.use('/api', pcrequestRouter);
app.use('/api', pcnotificationRouter);
app.use('/api', borrowRouter);
app.use('/api/auth', authRouter);
app.use('/api/requests', requestRouter(io));
app.use('/api/notifications', notificationRouter);
app.use('/api', uploadRouter);

// Start the Server with WebSocket enabled
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Export io for use in other modules
module.exports = { io, server, app };
// Socket.IO logic (optional example)
io.on('connection', (socket) => {
    // console.log('A user connected');
    console.log(`Socket connected: ${socket.id}`);
    
    socket.on('disconnect', () => {
        // console.log('A user disconnected');
        console.log(`Socket disconnected: ${socket.id}`);
    });
});


