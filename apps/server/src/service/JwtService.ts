import dotenv from "dotenv/config";
import type {
  JwtPayload,
  SignCallback,
  SignOptions,
  VerifyCallback,
} from "jsonwebtoken";
import type { StringValue } from "ms";
import jwt from "jsonwebtoken";
import { promisify } from "util";

const JWT_SECRET = process.env.JWT_SECRET!;

interface IJWTService {
  secret: string;
  sign: (payload: JwtPayload, options?: SignOptions) => string;
}

class JWTService implements IJWTService {
  secret;
  constructor(secret = JWT_SECRET) {
    this.secret = secret;
  }

  sign(payload: JwtPayload, options?: SignOptions) {
    return jwt.sign(payload, this.secret, options);
  }

  verify(token: string) {
    return jwt.verify(token, this.secret);
  }
}

export { JWTService };
