import * as z from "zod";

export const BalanceTransferSchema = z.object({
  to: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  amount: z.number().positive("Transfer money should be greater than 0"),
});
