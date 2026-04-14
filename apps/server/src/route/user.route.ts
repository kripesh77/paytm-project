import express from "express";

import {
  authenticate,
  getMe,
  signin,
  signup,
  updateMe,
  updatePassword,
} from "../controller/user.controller.js";

const Router = express.Router();

Router.post("/signup", signup);
Router.post("/signin", signin);
Router.get("/me", authenticate, getMe);
Router.patch("/update-me", authenticate, updateMe);
Router.patch("/update-password", authenticate, updatePassword);

export { Router as userRouter };
