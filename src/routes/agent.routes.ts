import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { orchestrateAgents } from "../agents/agent-orchestrator";
import { getCachedAgentOutput, invalidateAgentCache } from "../services/cache.service";
import { runQuestionAnswerAgent } from "../agents/question-answer.agent";

const router = Router();
router.use(authMiddleware);

router.get("/summary", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await orchestrateAgents(req.user!.userId);
        res.json({ summary: result.summary });
    } catch (error) {
        next(error);
    }
});

router.get("/goals", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await orchestrateAgents(req.user!.userId);    
        res.json({ goals: result.goals });
    } catch (error) {
        next(error);
    }    
});

router.get("/questions", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await orchestrateAgents(req.user!.userId);  
        res.json({ questions: result.questions });
    } catch (error) {
        next(error);
    }   
});

router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await orchestrateAgents(req.user!.userId);
        res.json(result);
    } catch (error) {
        next(error);
    }   
});

router.post("/refresh", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await invalidateAgentCache(req.user!.userId);
        const result = await orchestrateAgents(req.user!.userId);    
        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.get("/status", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cached = await getCachedAgentOutput(req.user!.userId);  
        res.json({ 
            hasData: !!cached,
            message: cached ? "Agent data available in cache" : "No cached data - call /api/agent/all to generate",
         });
    } catch (error) {
        next(error);
    }
});

router.post("/questions/answer", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { question } = req.body;

        if (!question || typeof question !== "string" || question.trim().length === 0) {
            return res.status(400).json({ 
                error: "Invalid request",
                message: "Please provide a valid 'question' field in request body" 
            });
        }

        // Get the cached agent output (or generate new)
        let agentResult = await getCachedAgentOutput(req.user!.userId);
        if (!agentResult) {
            agentResult = await orchestrateAgents(req.user!.userId);
        }

        // Run the question answer agent
        const answer = await runQuestionAnswerAgent(agentResult.summary, question.trim());

        res.json({
            question: question.trim(),
            answer: answer.answer,
            keyPoints: answer.keyPoints,
            recommendation: answer.recommendation,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
});

export default router;
