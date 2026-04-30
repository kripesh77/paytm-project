import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import { app } from "./app.js";
import { connectToDB } from "@repo/db/connect";

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI;
const SKIP_ENV = process.env.SKIP_ENV_VALIDATION === "true";

const init = async () => {
  try {
    if (MONGODB_URI) {
      console.log("Initializing Database Connection");
      await connectToDB(MONGODB_URI!);
      console.log("Database connection successful");
    } else if (!SKIP_ENV) {
      throw new Error("MONGODB_URI is not set");
    } else {
      console.log(
        "Skipping DB connection; MONGODB_URI not set and SKIP_ENV_VALIDATION is true",
      );
    }

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
