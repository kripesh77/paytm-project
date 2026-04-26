import UserModel from "@repo/db/model/User";
import { UserLoginSchema, UserSchema } from "@repo/zod/user.schema";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Request, Response, NextFunction } from "express";
import { signJWT, verifyJWT } from "../utils/signAndVerifyJWT.js";
import AccountModel from "@repo/db/model/Account";
import mongoose from "mongoose";

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = UserSchema.safeParse(req.body);
    if (!result.success) {
      return next(result.error);
    }
    const { email, username, firstName, lastName, password } = result.data;

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const user = new UserModel({
        email,
        username,
        firstName,
        lastName,
        password,
      });

      await user.save({ session });

      const account = new AccountModel({
        userId: user._id,
        balance: (1 + Math.ceil(Math.random() * 10000)) * 100,
      });

      await account.save({ session });

      await session.commitTransaction();

      const token = await signJWT(user._id.toString());

      res.json({ status: "success", user, token });
    } catch (err) {
      await session.abortTransaction();
      next(err);
    } finally {
      session.endSession();
    }
  },
);

export const signin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = UserLoginSchema.safeParse(req.body);
    if (!result.success) {
      return next(result.error);
    }

    const { identifier, password } = result.data;

    const user = await UserModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    }).select("+password");

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
      return next(new AppError("User doesn't exist", 404));
    }

    if (user.changedPasswordAfter(decoded.iat))
      return next(
        new AppError("Password was changed recently. Please re login", 401),
      );

    req.user = user;

    next();
  },
);
