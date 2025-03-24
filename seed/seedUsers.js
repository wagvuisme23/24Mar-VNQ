// seed/seedUsers.js
const mongoose = require('mongoose');
const userController = require('../controllers/users');
const roleSchema = require('../models/roles');
const userSchema = require('../models/users'); // Thêm để kiểm tra user tồn tại

async function seedUsers() {
    try {
        await mongoose.connect("mongodb://localhost:27017/C2");
        console.log("Connected to database");

        // Tạo 3 roles nếu chưa tồn tại
        const roles = [
            { roleName: 'admin', description: 'Administrator' },
            { roleName: 'moderator', description: 'Moderator' },
            { roleName: 'user', description: 'Regular User' }
        ];

        for (let roleData of roles) {
            const existingRole = await roleSchema.findOne({ roleName: roleData.roleName });
            if (!existingRole) {
                const newRole = new roleSchema(roleData);
                await newRole.save();
                console.log(`Created role: ${roleData.roleName}`);
            } else {
                console.log(`Role ${roleData.roleName} already exists, skipping...`);
            }
        }

        // Tạo 3 users với mỗi role
        const users = [
            {
                username: 'admin1',
                password: 'Admin@123',
                email: 'admin@example.com',
                fullName: 'John Admin',
                imgURL: 'https://example.com/admin.jpg',
                role: 'admin'
            },
            {
                username: 'mod1',
                password: 'Moderator@123',
                email: 'moderator@example.com',
                fullName: 'Mary Moderator',
                imgURL: 'https://example.com/moderator.jpg',
                role: 'moderator'
            },
            {
                username: 'user1',
                password: 'User@123',
                email: 'user@example.com',
                fullName: 'Peter User',
                imgURL: 'https://example.com/user.jpg',
                role: 'user'
            }
        ];

        for (let userData of users) {
            try {
                // Kiểm tra user tồn tại bằng username
                const existingUser = await userSchema.findOne({ username: userData.username });
                if (!existingUser) {
                    const result = await userController.createUser(
                        userData.username,
                        userData.password,
                        userData.email,
                        userData.role,
                        userData.fullName,
                        userData.imgURL
                    );
                    console.log(`Created user: ${userData.username}`);
                } else {
                    console.log(`User ${userData.username} already exists, skipping...`);
                }
            } catch (error) {
                console.log(`Error creating ${userData.username}: ${error.message}`);
            }
        }

        console.log("User creation completed");
        await mongoose.connection.close();
    } catch (error) {
        console.error("Error:", error);
    }
}

seedUsers();