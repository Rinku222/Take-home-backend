const pool = require('../db/connection');
const redisClient = require('../db/redis')

module.exports = {
    getUserByEmail: async (email) => {
        const query = `SELECT * FROM users WHERE email = $1`;
        const { rows } = await pool.query(query, [email]);
        return rows[0] || null;
    },
    getUser: async (user_id) => {
        const cacheKey = 'users_list';
        if (redisClient.isOpen) {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                console.log('Returning users from Redis cache');
                return JSON.parse(cachedData);
            }
        }
        const query = `SELECT name, email, id from users`;
        const { rows } = await pool.query(query);
        const filteredRows = rows.filter(row => row.id !== user_id);
        const result = {users: filteredRows || null , status : true, message : "Users List fetched successfully"};

        if (redisClient.isOpen) {
            await redisClient.setEx(cacheKey, 60, JSON.stringify(result));
        }

        return result;
    },
    invalidateUsersCache: async () => {
        if (redisClient.isOpen) {
            await redisClient.del('users_list');
            console.log('Users cache invalidated');
        }
    }
}