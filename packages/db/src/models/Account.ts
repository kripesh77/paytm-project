import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: (v: number) => Number.isInteger(v) && v >= 0,
      message: "Balance must be stored in paisa (1NPR = 100paisa)",
    },
  },
});

export type IAccountDocument = mongoose.HydratedDocument<
  mongoose.InferSchemaType<typeof accountSchema>
>;

const AccountModel = mongoose.model("Account", accountSchema);

export default AccountModel;
