import * as z from "zod";
import { Types } from "mongoose";

const objectIdSchema = z.preprocess(
  (val) => {
    if (val instanceof Types.ObjectId) return val.toString();
    return val;
  },
  z.string("Invalid ObjectId").regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
);

export const BalanceTransferSchema = z
  .object({
    to: objectIdSchema,
    userId: objectIdSchema,
    amount: z.coerce
      .number()
      .min(1000, "Transfer amount should be atleast 10 Rs"),
  })
  .refine((data) => data.userId !== data.to, {
    message: "You cannot transfer money to yourself",
    path: ["to"],
  });
