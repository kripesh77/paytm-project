import dotenv from "dotenv/config";
import { app } from "./app.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 8000;

async function init() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

init();
