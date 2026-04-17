import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface IUserMethods {
  correctPassword(candidatePassword: string): Promise<boolean>;
}

type IUserDocument = mongoose.HydratedDocument<IUser, IUserMethods>;

const userSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (this: IUserDocument) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.correctPassword = async function (
  this: IUserDocument,
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

type IUser = mongoose.InferSchemaType<typeof userSchema>;

const UserModel = mongoose.model<
  IUser,
  mongoose.Model<IUser, {}, IUserMethods>
>("User", userSchema);

export { type IUser };
export default UserModel;
