import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { router } from "./routes/index.js";
import globalErrorHandler from "./controllers/errorController.js";
import AppError from "./utils/appError.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

export { app };
