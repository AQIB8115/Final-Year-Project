
const redis = require('redis');
// Removed WebSocket (wss) setup because we use Socket.IO instead

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = { redisClient }; // Only export redisClient if needed
