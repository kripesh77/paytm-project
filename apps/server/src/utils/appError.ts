// utils/appError.ts
export default class AppError extends Error {
  statusCode: number;
  status: "fail" | "error";
  isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // operational errors are those created by the developer intentionally
    this.isOperational = true;

    // capture stack trace (excluding constructor from stack)
    Error.captureStackTrace(this, this.constructor);
  }
}
