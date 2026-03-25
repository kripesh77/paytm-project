import express from "express";
import { userRouter } from "./user.route.js";
import {
  handleUnhandledRoutes,
  globalErrorHandler,
} from "../controller/error.controller.js";
const Router = express.Router();

Router.use("/users", userRouter);

Router.use(handleUnhandledRoutes);

Router.use(globalErrorHandler);

export { Router as rootRouter };
