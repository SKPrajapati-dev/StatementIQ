import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { db } from "../lib/db";

const router = Router();
router.use(authMiddleware);

/**
 * GET /api/investments
 * Get all investments for the user
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const investments = db.investments.filter((inv) => inv.userId === req.user!.userId);
        res.json({ investments, count: investments.length });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/investments/:id
 * Get a specific investment by ID
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const investment = db.investments.find(
            (inv) => inv.id === req.params.id && inv.userId === req.user!.userId
        );

        if (!investment) {
            res.status(404).json({ error: "Investment not found" });
            return;
        }

        res.json(investment);
    } catch (error) {
        next(error);
    }
});

export default router;
