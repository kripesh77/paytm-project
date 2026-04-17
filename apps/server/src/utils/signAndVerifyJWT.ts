import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import jwt from "jsonwebtoken";
import { promisify } from "util";

const signAsync = promisify<
  string | Buffer | object,
  jwt.Secret,
  jwt.SignOptions,
  string
>(jwt.sign);
const verifyAsync = promisify<
  string,
  jwt.Secret,
  jwt.VerifyOptions,
  object | string
>(jwt.verify);

export const signJWT = async (id: string): Promise<string> => {
  const token = await signAsync({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN as unknown as number,
  });
  return token;
};

export const verifyJWT = async (token: string): Promise<any> => {
  const data = await verifyAsync(token, process.env.JWT_SECRET as string, {});
  return data;
};
