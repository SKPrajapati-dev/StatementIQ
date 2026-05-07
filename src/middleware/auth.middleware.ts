import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "../types/user.types";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as AuthPayload;
        req.user = payload;
        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });    
    }
}