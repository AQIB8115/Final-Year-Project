import { io } from "socket.io-client";

// Replace with your backend's WebSocket URL
const SOCKET_URL = "http://localhost:5000"; 

// Initialize the socket instance
export const socket = io(SOCKET_URL, {
    transports: ["websocket"], // Ensures the use of WebSocket protocol
    reconnectionAttempts: 5, // Attempts to reconnect 5 times
});

// Optional: Log connection events for debugging
socket.on("connect", () => {
    console.log("Connected to WebSocket server with ID:", socket.id);
});

socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server.");
});
