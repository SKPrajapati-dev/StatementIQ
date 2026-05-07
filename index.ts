import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

//Routes
import authRoutes from "./src/routes/auth.routes";
import statementsRoutes from "./src/routes/statements.routes";
import loansRoutes from "./src/routes/loans.routes";
import fdRoutes from "./src/routes/fd.routes";
import investmentsRoutes from "./src/routes/investments.routes";
import agentRoutes from "./src/routes/agent.routes";

const app = express();

app.use(helmet());
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
)

app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers        
})
app.use("/api", limiter);

app.use("/health", (_req, res) => {
    res.json({ status: "ok" });
})

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/statements", statementsRoutes);
app.use("/api/loans", loansRoutes);
app.use("/api/fd", fdRoutes);
app.use("/api/investments", investmentsRoutes);
app.use("/api/agent", agentRoutes);

app.use((_req, res) => {
    res.status(404).json({ error: "Not Found" });
})

async function bootstrap() {
    try {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });
    } catch (error) {
        console.error("Error starting server:", error); 
    }
}

bootstrap();