import express, { NextFunction, Request, Response } from "express";
import v1Router from "./Routers/router";
import cors from "cors";
import dotenv from "dotenv";
import { DB_CONNECTION } from "./DB/DB.connection";
import { AppError } from "./middlewares/errorHandler";
import morgan from "morgan";

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.DBCONNECTION) {
  console.error("Missing required environment variable: DBCONNECTION");
  process.exit(1);
}

const PORT = +process.env.PORT! || 3000;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/v1", v1Router);

// 404 Route Handler
app.all("*", (req, res, next) => {
  throw new AppError("Route not found", 404);
});

// Global Error Handler
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  const { status, stack, message } = err;
  res.status(status || 500).json({
    status: "error",
    message,
    ...(process.env.MODE === "development" && { stack }),
  });
});

// Start the server
const startServer = async () => {
  try {

    await DB_CONNECTION();
    console.log("Database connected successfully");


    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer()
  .then(() => {
    console.log("Server startup completed.");
  })
  .catch((error) => {
    console.error("Server startup failed:", error);
    process.exit(1);
  });