import UserModel from "@repo/db/model/User";
import { UserLoginSchema, UserSchema } from "@repo/zod/userSchema";
import { prettifyError } from "@repo/zod/prettifyError";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Request, Response, NextFunction } from "express";
import { signJWT, verifyJWT } from "../utils/signAndVerifyJWT.js";

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = UserSchema.safeParse(req.body);
    if (!result.success) {
      return next(result.error);
    }
    const { username, firstName, lastName, password } = result.data;

    const user = await UserModel.create({
      username,
      firstName,
      lastName,
      password,
    });

    const token = await signJWT(user._id.toString());
    res.json({ status: "success", user, token });
  },
);

export const signin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = UserLoginSchema.safeParse(req.body);
    if (!result.success) {
      return next(result.error);
    }

    const { username, password } = result.data;

    const user = await UserModel.findOne({ username }).select("+password");

    if (!user) {
      return next(new AppError("User doesn't exist", 404));
    }

    if (!(await user.correctPassword(password))) {
      return next(new AppError("Incorrect password", 411));
    }

    const token = await signJWT(user._id.toString());
    const { password: _, ...safeUser } = user.toObject();
    res.json({ status: "success", user: safeUser, token });
  },
);

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token = "";
    const authorization = req.headers["authorization"];
    if (authorization && authorization?.startsWith("Bearer")) {
      token = authorization.split(" ")[1] as string;
    }

    if (!token) {
      return next(new AppError("Not authorized", 400));
    }

    const decoded = await verifyJWT(token);

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return next(new AppError("User doesn't exist", 400));
    }

    req.user = user;

    next();
  },
);
