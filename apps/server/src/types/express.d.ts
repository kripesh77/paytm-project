import { IUserDocument } from "@repo/db/model/User";

// @types/express/index.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}
export {};
