import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.middleware";


const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await fdService.getFDAccounts(req.user!.userId);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await fdService.getFDById(req.user!.userId, req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export default router;