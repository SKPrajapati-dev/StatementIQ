import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { db } from "../lib/db";

const router = Router();
router.use(authMiddleware);

/**
 * GET /api/loans
 * Get all loans for the user
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loans = db.loans.filter((loan) => loan.userId === req.user!.userId);
        res.json({ loans, count: loans.length });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/loans/:id
 * Get a specific loan by ID
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loan = db.loans.find(
            (loan) => loan.id === req.params.id && loan.userId === req.user!.userId
        );

        if (!loan) {
            res.status(404).json({ error: "Loan not found" });
            return;
        }

        res.json(loan);
    } catch (error) {
        next(error);
    }
});

export default router;
