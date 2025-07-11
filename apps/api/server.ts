import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import optimizeRoute from "./routes/optimize";

// Load environment variables
dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || "3001", 10);

// Add CORS middleware for all routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

// Import and use the image optimization route
app.use(optimizeRoute);

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
