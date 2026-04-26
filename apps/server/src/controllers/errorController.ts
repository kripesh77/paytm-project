import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import AppError from "../utils/appError.js";
import { prettifyError } from "@repo/zod/prettifyError";

const formatZodErrors = (err: ZodError) =>
  err.issues.map((e) => ({
    path: e.path.join("."),
    message: e.message,
  }));

const handleCastErrorDB = (err: any) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateEntry = (err: any) => {
  const keyValue = err.keyValue as Record<string, any> | undefined;

  if (!keyValue) {
    return new AppError("Duplicate field value", 401);
  }

  const field = Object.keys(keyValue)[0];

  if (!field) {
    return new AppError("Duplicate field value", 401);
  }

  const value = keyValue[field];

  return new AppError(`${field}: ${value} already exists`, 401);
};

const handleValidationError = (err: any) => {
  const message = Object.values(err.errors || {})
    .map((el: any) => el.message)
    .join(". ");

  return new AppError(`Invalid input data. ${message}`, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token, please login again!", 401);

const handleJWTExpired = () =>
  new AppError("Token expired. Please relogin", 401);

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "fail",
      message: "Validation failed",
      errors: err.issues.reduce<Record<string, string[]>>((acc, issue) => {
        const field = issue.path.join(".");

        if (!acc[field]) {
          acc[field] = [];
        }

        acc[field].push(issue.message);
        return acc;
      }, {}),
    });
  }

  if (err.name === "CastError") err = handleCastErrorDB(err);
  if (err.code === 11000) err = handleDuplicateEntry(err);
  if (err.name === "ValidationError") err = handleValidationError(err);
  if (err.name === "JsonWebTokenError") err = handleJWTError();
  if (err.name === "TokenExpiredError") err = handleJWTExpired();

  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  if (err.isOperational) {
    return res.status(statusCode).json({
      status,
      message: err.message,
    });
  }

  console.error({
    message: err.message,
    stack: err.stack,
    name: err.name,
  });

  return res.status(500).json({
    status: "error",
    message: "Something went very wrong!",
  });
};

export default globalErrorHandler;
