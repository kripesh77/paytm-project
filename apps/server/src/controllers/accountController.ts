import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import AccountModel from "@repo/db/model/Account";
import { BalanceTransferSchema } from "@repo/zod/account.schema";
import UserModel from "@repo/db/model/User";
import mongoose from "mongoose";

export const getBalance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) return next(new AppError("User doesn't exists"));

    const balance = await AccountModel.findOne(
      { userId: user._id },
      { balance: 1, _id: 0 },
    );

    res.status(200).json({ status: "success", data: balance });
  },
);

export const transferBalance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return next(new AppError("User doesn't exist!", 404));

    const result = BalanceTransferSchema.safeParse(req.body);

    if (!result.success) {
      console.log(result.error.message);
      return next(result.error);
    }

    const { to, amount } = result.data;

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const UserAccountInfo = await AccountModel.findOne(
        { userId: user._id },
        { balance: 1, _id: 0 },
      ).session(session);

      if (!UserAccountInfo) {
        await session.abortTransaction();
        return next(
          new AppError("Account associated to this user doesn't exist.", 404),
        );
      }

      if (amount > UserAccountInfo.balance) {
        await session.abortTransaction();
        return next(
          new AppError(
            "You don't have sufficient balance to transfer the fund",
            400,
          ),
        );
      }

      const receiver = await AccountModel.findOne(
        { userId: to },
        { username: 1 },
      ).session(session);

      if (!receiver || receiver._id === user._id) {
        await session.abortTransaction();
        return next(new AppError("Receiver doesn't exist", 404));
      }

      await AccountModel.updateOne(
        { userId: req.user._id },
        { $inc: { balance: -amount } },
        { session },
      );
      await AccountModel.updateOne(
        { userId: to },
        { $inc: { balance: amount } },
        { session },
      );

      await session.commitTransaction();
      res.json({
        status: "success",
        message: "Fund successfully transferred",
      });
    } catch (err) {
      await session.abortTransaction();
      next(err);
    } finally {
      await session.endSession();
    }
  },
);
