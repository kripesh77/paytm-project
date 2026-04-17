import { Router } from "express";
import { updateInfo } from "../controllers/userController.js";
import { protect } from "../controllers/authController.js";
const router = Router();

// router.get("/bulk", getUsers);
router.post("/update", protect, updateInfo);

export { router as userRouter };
