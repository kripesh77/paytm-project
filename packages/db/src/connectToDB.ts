import mongoose from "mongoose";

// Module-level cache - persists across warm invocations in serverless
let cachedConnection: typeof mongoose | null = null;
let cachedPromise: Promise<typeof mongoose> | null = null;

export const connectToDB = async (URI: string) => {
  // Return cached connection if available (reuse from warm invocations)
  if (cachedConnection) {
    console.log("Reusing cached MongoDB connection");
    return cachedConnection;
  }

  if (!URI) {
    throw new Error("Missing MONGODB_URI");
  }

  // Create connection promise only once, even if called multiple times concurrently
  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
        maxPoolSize: 10,
        minPoolSize: 0,
        maxIdleTimeMS: 5000,
      })
      .catch((err) => {
        console.error("Mongoose connection error:", err);
        // Reset promise on failure so subsequent attempts can retry
        cachedPromise = null;
        throw err;
      });
  }

  try {
    cachedConnection = await cachedPromise;
    return cachedConnection;
  } catch (err) {
    console.error("Mongoose connection failed:", err);
    throw err;
  }
};
