import mongoose from "mongoose";

type Cache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: Cache | undefined;
}

const cache: Cache = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};

export const connectToDB = async (URI: string) => {
  if (cache.conn) return cache.conn;

  if (!URI) {
    throw new Error("Missing MONGODB_URI");
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      })
      .catch((err) => {
        console.error("Mongoose initial connection error:", err);
        // reset promise so subsequent attempts can retry
        cache.promise = null;
        throw err;
      });
  }

  try {
    cache.conn = await cache.promise;
    globalThis.mongooseCache = cache;
    return cache.conn;
  } catch (err) {
    console.error("Mongoose connection failed:", err);
    throw err;
  }
};
