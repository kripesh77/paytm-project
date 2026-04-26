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

  if (!cache.promise) {
    cache.promise = mongoose.connect(URI, {
      bufferCommands: false,
    });
  }

  cache.conn = await cache.promise;

  globalThis.mongooseCache = cache;

  return cache.conn;
};
