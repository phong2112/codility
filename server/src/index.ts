import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import logger from "morgan";
import { initializeDatabaseConnection } from "./database";
import jobRouter from "./routes/jobs";
import companyRouter from "./routes/company";
import cors from "cors";
import { swaggerDocs, swaggerUi } from "./swagger";
import { LIST_ALLOW_ORIGIN } from "./constants";

dotenv.config();

const app: Express = express();

app.use(express.json());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: [...LIST_ALLOW_ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  })
);

// Initialize database
initializeDatabaseConnection();

// Configure routers api
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/jobs", jobRouter);
app.use("/companies", companyRouter);

// Port and listening
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
