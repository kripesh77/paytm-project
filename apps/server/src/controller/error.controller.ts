import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsyncError.js";
import ApiError from "../utils/apiError.js";

export const handleUnhandledRoutes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.json({
      status: "fail",
      message: `Oops! Unhandled route ${req.originalUrl}`,
    });
  },
);

const handleCastErrorDB = (err: any) => {
  return new ApiError(`Invalid ${err.path}: ${err.value}`, 400);
};

const handleDuplicateEntry = (err: any) => {
  // Tip: Don't try to remember the field names
  // try to grab the concept
  // these fields are referenced from the error and then written
  return new ApiError(
    `${err.keyValue.name || err.keyValue.username || `'${err.keyValue.email}'`} already exists`,
    400,
  );
};

const handleValidationError = (err: any) => {
  const errorMessage = Object.values(err.errors)
    .map((el) => (el as any).message)
    .join(". ");
  return new ApiError(`Invalid input data. ${errorMessage}`, 400);
};

const handleJWTError = () =>
  new ApiError("Invalid token, please login again!", 401);

const handleJWTTokenExpiredError = () =>
  new ApiError("Token expired. Please relogin", 401);

const handleZodError = (err: any) => {
  const errMessage = { name: err.name, err: err.message };
  return new ApiError(JSON.stringify(errMessage) as unknown as string, 401);
};

const sendDevError = (err: ApiError, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdError = (err: any, res: Response) => {
  // Operational: send response to the client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details to the client
  } else {
    // 1) log the error:
    console.error("ERROR 💥", err);

    // 2) Send the generic message:
    return res
      .status(500)
      .json({ status: "error", message: "Something went very wrong!" });
  }
};

export const globalErrorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  Next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error: any = {
      ...err,
      name: err.name,
      message: err.message,
      stack: err.stack,
    };

    if (error.name === "ZodError") error = handleZodError(error);
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if ((error as any).code === 11000) error = handleDuplicateEntry(error);
    if (error.name === "ValidationError") error = handleValidationError(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError")
      error = handleJWTTokenExpiredError();

    sendProdError(error, res);
  }
};
