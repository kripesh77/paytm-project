import type { NextFunction, Request, Response } from "express";
import { UserModel } from "@repo/db/user.model";
import {
  UserSchema,
  LoginSchema,
  UserUpdateSchema,
  PasswordUpdateSchema,
  type User,
} from "@repo/zod/index";
import { catchAsync } from "../utils/catchAsyncError.js";
import ApiError from "../utils/apiError.js";
import type { StringValue } from "ms";
import { JWTService } from "../service/JwtService.js";
import type { Types } from "mongoose";

type Usr = Omit<User, "password" | "passwordConfirm"> & {
  password?: string;
  _id: Types.ObjectId;
};

declare global {
  namespace Express {
    interface Request {
      user?: Usr;
    }
  }
}

const jwtService = new JWTService();

export const healthCheck = (req: Request, res: Response) => {
  res.json({ status: "good", timestamp: Date.now() });
};

export const signin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const result = LoginSchema.parse(body);

    const user = await UserModel.findOne({ username: result.username }).select(
      "+password",
    );

    if (!user || !(await user.correctPassword(result.password))) {
      return next(new ApiError("Invalid credentials", 400));
    }

    const token = jwtService.sign(
      { id: user._id },
      { expiresIn: process.env.JWT_EXPIRES_IN as StringValue },
    );

    return res.json({ status: "success", data: { user, token } });
  },
);

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = UserSchema.parse(req.body);

    const user = await UserModel.create(result);

    const token = jwtService.sign(
      { id: user._id },
      { expiresIn: process.env.JWT_EXPIRES_IN as StringValue },
    );

    return res.json({ status: "success", data: { user, token } });
  },
);

export const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new ApiError("User doesn't exists", 400));
    }

    return res.json({ status: "success", data: { user } });
  },
);

export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName } = UserUpdateSchema.parse(req.body);

    const user = req.user;

    if (!user) return;

    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        firstName,
        lastName,
      },
      { returnDocument: "after" },
    );

    return res.json({ status: "success", data: { user: updatedUser } });
  },
);

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword, newPasswordConfirm } =
      PasswordUpdateSchema.parse(req.body);
  },
);

export const authenticate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    let token;
    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];
    }

    if (!token) {
      return next(new ApiError("Invalid token", 400));
    }

    const payload = jwtService.verify(token);

    if (!payload) {
      return next(new ApiError("Invalid token", 400));
    }

    const user = await UserModel.findById((payload as { id: string }).id);

    if (!user) {
      return next(new ApiError("Invalid token", 400));
    }

    req.user = user;

    next();
  },
);
