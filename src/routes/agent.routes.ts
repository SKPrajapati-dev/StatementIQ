import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
router.use(authMiddleware);

router.get("/summary", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await orchestrateAgenets(req.user!.userId);
        res.json({ summary: result.summary });
    } catch (error) {
        next(error);
    }
});

router.get("/goals", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await orchestrateAgenets(req.user!.userId);    
        res.json({ goals: result.goals });
    } catch (error) {
        next(error);
    }    
});

router.get("/questions", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await orchestrateAgenets(req.user!.userId);  
        res.json({ questions: result.questions });
    } catch (error) {
        next(error);
    }   
});

router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await orchestrateAgenets(req.user!.userId);
        res.json(result);
    } catch (error) {
        next(error);
    }   
});

router.post("/refresh", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await invalidateAgentCache(req.user!.userId);
        const result = await orchestrateAgenets(req.user!.userId, true);    
        res.json(result);
    } catch (error) {
        next(error);
    }
});


router.get("/status", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const  { getCachedAgentOutput } = await import ("../src/services/cache.service");
        const cached = await getCachedAgentOutput(req.user!.userId);  
        res.json({ 
            hasData: !!cached,
            message: cached ? "Agent data available in cache" : "No cached data - call /api/agents/all to generate",
         });
    } catch (error) {
        next(error);
    }
});

export default router;
