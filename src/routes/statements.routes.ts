import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { registerUser, loginUser } from "../controllers/auth.controller";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const months = parseInt(req.query.months as string) || 6;
        const result = await statementsService.getTransactions(req.user!.userId, months);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const result = await statementsService.getTransactionById(req.user!.userId, req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export default router;