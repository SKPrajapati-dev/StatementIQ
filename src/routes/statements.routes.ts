import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { db } from "../lib/db";

const router = Router();
router.use(authMiddleware);

/**
 * GET /api/statements
 * Get transactions for the user, optionally filtered by months
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const months = parseInt(req.query.months as string) || 6;
        const since = new Date();
        since.setMonth(since.getMonth() - months);

        const transactions = db.transactions.filter(
            (tx) => tx.userId === req.user!.userId && new Date(tx.date) >= since
        );

        res.json({ transactions, count: transactions.length });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/statements/:id
 * Get a specific transaction by ID
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const transaction = db.transactions.find(
            (tx) => tx.id === req.params.id && tx.userId === req.user!.userId
        );

        if (!transaction) {
            res.status(404).json({ error: "Transaction not found" });
            return;
        }

        res.json(transaction);
    } catch (error) {
        next(error);
    }
});

export default router;