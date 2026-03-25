import { model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import type { User } from "@repo/zod/index";

// 2️⃣ Extend Mongoose Document
export interface IUserDocument extends User, Document {
  correctPassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<IUserDocument> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Name is required"],
      minLength: [3, "Name must be atleast 3 chars long"],
      maxLength: [30, "Name must be atmost 30 chars long"],
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: [true, "firstName is required"],
      minLength: [3, "firstName should be atleast 3 chars long"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "lastName is required"],
      minLength: [3, "lastName should be atleast 3 chars long"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password should be atleast 8 chars long"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Confirm password is required"],
      validate: {
        validator: function (val: string) {
          return val === (this as IUserDocument).password;
        },
        message: "Passwords donot match!",
      },
    },
    passwordChangedAt: Date,
  },
  { timestamps: true },
);

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre<IUserDocument>("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

const UserModel = model("User", userSchema);

export { UserModel };
