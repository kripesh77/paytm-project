import { HttpStatus } from "../types/EHttpStatusCode.js";
import type { err } from "../types/IApiError.js";

class ApiError extends Error implements err {
  status;
  statusCode;
  isOperational;

  constructor(message: string, statusCode: HttpStatus) {
    super(message);

    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.statusCode = statusCode || 500;

    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
