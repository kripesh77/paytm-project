import { Router } from "express";
import { authRouter } from "./authRoute.js";
import { userRouter } from "./userRoute.js";
import { accountRouter } from "./accountRoute.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/account", accountRouter);

export { router };
