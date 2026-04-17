import mongoose from "mongoose";

export const connectToDB = (URI: string) => {
  return mongoose.connect(URI);
};
