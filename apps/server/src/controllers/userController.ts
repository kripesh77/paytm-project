import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import { UserUpdateSchema } from "@repo/zod/userSchema";
import AppError from "../utils/appError.js";
import UserModel from "@repo/db/model/User";

export const updateInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) next(new AppError("Unauthorized", 401));

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
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ]);

    res.json({ users });
  },
);
