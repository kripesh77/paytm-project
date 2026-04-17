import * as z from "zod";

const password = z.string().min(8, "Password must be at least 8 chars long");

const baseUser = z.object({
  username: z.string().min(3, "Username must be at least 3 chars"),
  firstName: z.string().min(3, "First name must be at least 3 chars"),
  lastName: z.string().min(3, "Last name must be at least 3 chars"),
  password,
  passwordChangedAt: z.date().optional(),
});

// ✅ Signup (form schema)
export const UserSchema = baseUser
  .extend({
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

// ✅ Login (clean)
export const UserLoginSchema = z.object({
  username: z.string(),
  password,
});

// ✅ Update profile
export const UserUpdateSchema = z
  .object({
    firstName: z.string().min(3).optional(),
    lastName: z.string().min(3).optional(),
  })
  .loose()
  .superRefine((obj, ctx) => {
    const allowedKeys = ["firstName", "lastName"];
    for (const key of Object.keys(obj)) {
      if (!allowedKeys.includes(key)) {
        ctx.addIssue({
          code: "custom", // modern replacement for ZodIssueCode.custom
          path: [key], // points to the extra field
          message: `Unexpected field: ${key}`,
        });
      }
    }
  });

// ✅ Password update
export const PasswordUpdateSchema = z
  .object({
    currentPassword: password,
    newPassword: password,
    newPasswordConfirm: password,
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "Passwords do not match",
    path: ["newPasswordConfirm"],
  });

export type IBaseUser = z.infer<typeof baseUser>;
