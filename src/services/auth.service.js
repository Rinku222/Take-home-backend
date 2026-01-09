const { generateToken } = require('../middleware/auth.js');
const pool = require('../db/connection.js');
const UserService = require('./user.service.js') 
const { PasswordFun } = require('../utils/index.js')

module.exports = {
    register: async ({ name, email, password }) =>{
        const existingUser = await pool.query(
            `SELECT id FROM users WHERE email = $1`,
            [email]
            );
        
        if (existingUser.rowCount > 0) {
            return { status : false, message : "User already exists with this email"} 
        }

        const result = await pool.query(
        `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email
        `,
        [name, email, password]
        );

        const user = result.rows[0];

        await UserService.invalidateUsersCache();

        const token = generateToken({
            id: user.id,
            email: user.email
        });

        return {
            message: 'User registered successfully',
            token,
            user,
            status: true
        };
    },

    login: async (body) => {
        const { email, password } = body;

        const user = await UserService.getUserByEmail(email);
        if (!user) {
            return {
                    status: false,
                    message: "User not found with this email"
            };
        }

        const isMatch = await PasswordFun.comparePassword(password, user.password_hash);
        if (!isMatch) {
            return {
                    status: false,
                    message: "Invalid credentials"
            };
        }

        const token = generateToken({ id: user.id, email: user.email });
        return {
                status: true,
                message: "Login successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                token
        };
    }

}