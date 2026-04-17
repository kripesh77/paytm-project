import { Router } from "express";
import { authRouter } from "./authRoute.js";
import { userRouter } from "./userRoute.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);

export { router };
