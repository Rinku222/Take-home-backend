const redis = require("redis");
require("dotenv").config();

const client = redis.createClient({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

let isConnected = false;

client.on("error", (err) => {
  console.warn("Redis Client Error:", err.message);
  console.warn(
    "Application will continue without caching. Please start Redis for optimal performance."
  );
  isConnected = false;
});

client.on("connect", () => {
  console.log("Connected to Redis");
  isConnected = true;
});

client.on("ready", () => {
  isConnected = true;
});

client.connect().catch((err) => {
  console.warn("Could not connect to Redis:", err.message);
  console.warn(
    "Application will continue without caching. Please ensure Redis is running."
  );
  isConnected = false;
});

client.isReady = () => isConnected;

module.exports = client;
