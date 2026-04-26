import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import { app } from "./app.js";
import { connectToDB } from "@repo/db/connect";

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI);

const init = async () => {
  console.log("Initializing Database Connection");
  await connectToDB(MONGODB_URI!);
  console.log("Database connection successful");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

init();
