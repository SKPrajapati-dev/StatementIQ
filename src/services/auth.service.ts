import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginRequest, RegisterRequest } from "../types/user.types";
import { db } from "../lib/db";

export class AuthService {
    async register(data: RegisterRequest) {
        const existing = db.users.find(
            (u) => u.email === data.email || u.accountNumber === data.accountNumber
        );

        if (existing) {
            throw new Error("User with this email or account number already exists");
        }
        
        // For demonstration, we will just return a mock user
        const hashedPassword = await bcrypt.hash(data.password, 10);   
        const user = {
            id: `user_${Date.now()}`,
            email: data.email,
            name: data.name,
            accountNumber: data.accountNumber,
            passwordHash: hashedPassword,
            phone: data.phone ?? null,
            createdAt: new Date().toISOString(),
        };

        db.users.push(user);
        const token = this.signToken(user.id, user.email);
        const { passwordHash: _, ...safeUser } = user;
        return { token, user: safeUser }
    }

    async login(data: LoginRequest) {
        const user = db.users.find((u) => u.email === data.email);

        if (!user) {
            throw new Error("Invalid email or password");
        }
        const isValid = await bcrypt.compare(data.password, user.passwordHash);
        if (!isValid) {
            throw new Error("Invalid email or password");
        }
        
        const token = this.signToken(user.id, user.email);
        const { passwordHash: _, ...safeUser } = user;
        return { token, user: safeUser }
    }

    async getMe(userId: string) {
        const user = db.users.find((u) => u.id === userId);
        if (!user) {
            throw new Error("User not found");
        }
        const { passwordHash: _, ...safeUser } = user;
        return { user: safeUser };
    }

    private signToken(userId: string, email: string) {
        const payload = { userId, email };
        return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
    }
}

export const authService = new AuthService();