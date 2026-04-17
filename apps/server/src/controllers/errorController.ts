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
    return new AppError("Duplicate field value", 411);
  }

  const field = Object.keys(keyValue)[0];

  if (!field) {
    return new AppError("Duplicate field value", 400);
  }

  const value = keyValue[field];

  return new AppError(`${field}: ${value} already exists`, 400);
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
      message: err,
      errors: formatZodErrors(err),
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

  console.error("ERROR 💥", err);

  return res.status(500).json({
    status: "error",
    message: "Something went very wrong!",
  });
};

export default globalErrorHandler;
