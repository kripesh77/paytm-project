import * as z from "zod";

const base = z.object({
  username: z
    .string({
      error: (iss) => {
        if (iss.input === undefined) {
          return "Field is required!";
        }
      },
    })
    .min(3, { message: "username must be atleast 3 chars long" }),
  firstName: z
    .string()
    .min(3, { message: "firstName must be atleast 3 chars long" }),
  lastName: z
    .string()
    .min(3, { message: "lastName must be atleast 3 chars long" }),
  password: z
    .string()
    .min(8, { message: "password must be atleast 8 chars long" }),
  passwordConfirm: z.string().or(z.undefined()),
  passwordChangedAt: z.date().optional(),
});

export const PasswordUpdateSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "password must be atleast 8 chars long" }),
    newPassword: z
      .string()
      .min(8, { message: "password must be atleast 8 chars long" }),
    newPasswordConfirm: z
      .string()
      .min(8, { message: "password must be atleast 8 chars long" }),
  })
  .strict()
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "Passwords do not match",
    path: ["newPasswordConfirm"],
  });

export const BaseUserSchema = base;

export const UserSchema = BaseUserSchema.refine(
  (values) => values.password === values.passwordConfirm,
  {
    message: "Don't match",
    path: ["passwordConfirm"],
  },
);

export const LoginSchema = BaseUserSchema.pick({
  username: true,
  password: true,
  passwordConfirm: true,
});

export const UserUpdateSchema = BaseUserSchema.pick({
  firstName: true,
  lastName: true,
}).strict();

export type User = z.infer<typeof UserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UpdateUserInput = z.infer<typeof UserUpdateSchema>;
export type PasswordUpdateInput = z.infer<typeof PasswordUpdateSchema>;
