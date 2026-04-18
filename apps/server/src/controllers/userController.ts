import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import { PasswordUpdateSchema, UserUpdateSchema } from "@repo/zod/user.schema";
import AppError from "../utils/appError.js";
import UserModel from "@repo/db/model/User";
import { signJWT } from "../utils/signAndVerifyJWT.js";

export const updateInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));

    const result = UserUpdateSchema.safeParse(req.body);
    if (!result.success) {
      return next(result.error);
    }

    const { firstName, lastName } = result.data;

    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName },
      { returnDocument: "after" },
    );

    res.json({ user });
  },
);

export const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filter = String(req.query["filter"] ?? "");

    const users = await UserModel.find().or([
      {
        firstName: {
          $regex: `^${filter}`,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: `^${filter}`,
          $options: "i",
        },
      },
    ]);

    res.json({ users });
  },
);

export const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return next(new AppError("User doesn't exist", 400));

    const result = PasswordUpdateSchema.safeParse(req.body);

    if (!result.success) return next(result.error);

    const freshUser = await UserModel.findById(user.id).select("+password");

    if (!freshUser) return next(new AppError("user doesn't exist", 404));

    if (!(await freshUser.correctPassword(result.data.currentPassword))) {
      return next(new AppError("Incorrect password", 401));
    }

    freshUser.password = result.data.newPassword;
    await freshUser.save();
    const token = await signJWT(freshUser._id.toString());

    const { password: _, ...safeUser } = freshUser.toObject();

    res.status(200).json({
      status: "success",
      user: safeUser,
      token,
    });
  },
);
