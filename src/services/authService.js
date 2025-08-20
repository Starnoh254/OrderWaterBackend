const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class authService {
    static async findUserByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    }

    static async registerUser(email, password, role = 'user') {
        const existingUser = await this.findUserByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, role },
        });
        return { id: user.id, email: user.email, role: user.role };
    };

    static async loginUser(email, password) {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { token, user: { id: user.id, email: user.email, role: user.role } };
    };

    static async registerAdmin(email, password) {
        return this.registerUser(email, password, 'admin');
    };
}



module.exports = authService