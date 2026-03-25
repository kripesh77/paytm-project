import express from "express";

import {
  authenticate,
  getMe,
  healthCheck,
  signin,
  signup,
  updateMe,
} from "../controller/user.controller.js";

const Router = express.Router();

Router.post("/signup", signup);
Router.post("/signin", signin);
Router.get("/me", authenticate, getMe);
Router.patch("/update-me", authenticate, updateMe);

export { Router as userRouter };
