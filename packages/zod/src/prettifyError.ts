import * as z from "zod";

export const prettifyError = (err: z.ZodError) => {
  return z.prettifyError(err);
};
