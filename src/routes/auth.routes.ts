import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { authService } from "../services/auth.service";

const router = Router();


router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    } 
});

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.login(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.get("/me", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.getMe(req.user!.userId);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export default router;