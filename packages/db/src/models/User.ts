import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

interface IUserMethods {
  correctPassword(candidatePassword: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: EpochTimeStamp): boolean;
}

type IUserDocument = mongoose.HydratedDocument<IUser, IUserMethods>;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (val) {
          return validator.isEmail(val);
        },
        message: "Please provide a valid email",
      },
    },
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minLength: 3,
      maxLength: 30,
    },
    firstName: {
      type: String,
      required: [true, "first name is required"],
      trim: true,
      lowercase: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
      trim: true,
      lowercase: true,
      maxLength: 50,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
      minLength: 8,
    },
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
  },
);

userSchema.index({ firstName: 1 });
userSchema.index({ lastName: 1 });

userSchema.pre("save", async function (this: IUserDocument) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return;

  this.passwordChangedAt = new Date(Date.now() - 1000);
});

userSchema.methods.correctPassword = async function (
  this: IUserDocument,
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changedPasswordAfter = function (
  this: IUserDocument,
  JWTTimestamp: EpochTimeStamp,
) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < passwordChangedTimestamp;
  }
  return false; // password is not changed yet
};

type IUser = mongoose.InferSchemaType<typeof userSchema>;

const UserModel = mongoose.model<
  IUser,
  mongoose.Model<IUser, {}, IUserMethods>
>("User", userSchema);

export { type IUser };
export default UserModel;
