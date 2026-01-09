const pool = require("../db/connection");
const redisClient = require("../db/redis");

module.exports = {
  createEvent: async (data, userId) => {
    const query = `
        INSERT INTO events
        (title, description, location, event_date, created_by,invited_user_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`;

    const values = [
      data.title,
      data.description,
      data.location,
      data.event_date,
      userId,
      data.invited_user_id,
    ];

    const { rows } = await pool.query(query, values);

    await invalidateEventCache(userId);
    if (data.invited_user_id) {
      await invalidateEventCache(data.invited_user_id);
    }

    return {
      status: true,
      message: "Event created successfully",
      data: rows[0],
    };
  },

  listEvents: async (userId) => {
    const cacheKey = `event_list:${userId}`;
    if (redisClient.isOpen) {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log("Returning events from Redis cache");
        return JSON.parse(cachedData);
      }
    }

    const { rows } = await pool.query(
      `SELECT * FROM events WHERE created_by = $1 OR invited_user_id = $1 ORDER BY event_date ASC`,
      [userId]
    );

    const result = { status: true, data: rows };

    if (redisClient.isOpen) {
      await redisClient.setEx(cacheKey, 60, JSON.stringify(result));
    }

    return result;
  },
  
  deleteEvent: async (eventId, userId) => {
    const { rowCount } = await pool.query(
      `DELETE FROM events WHERE id = $1 AND created_by = $2`,
      [eventId, userId]
    );

    if (!rowCount) {
      return { status: false, message: "Unauthorized or event not found" };
    }

    await invalidateEventCache(userId);

    return {
      status: true,
      message: "Event deleted successfully",
    };
  },
};

async function invalidateEventCache(userId) {
  if (redisClient.isOpen) {
    await redisClient.del(`event_list:${userId}`);
  }
}
