import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import { app } from "./app.js";
import { connectToDB } from "@repo/db/connect";

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI;

const init = async () => {
  try {
    if (!MONGODB_URI) {
      console.error("MONGODB_URI is not set. Aborting startup to avoid unexpected behavior.");
      process.exit(1);
    }

    console.log("Initializing Database Connection");
    await connectToDB(MONGODB_URI!);
    console.log("Database connection successful");

    // On Vercel serverless runtime we should not call app.listen()
    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } else {
      console.log("Running on Vercel, skipping app.listen");
    }
  } catch (err) {
    console.error("Failed to initialize server:", err);
    process.exit(1);
  }
};

init();
