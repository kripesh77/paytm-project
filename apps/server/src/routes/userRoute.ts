import { Router } from "express";
import {
  getUsers,
  updateInfo,
  changePassword,
  getMe,
} from "../controllers/userController.js";
import { protect } from "../controllers/authController.js";
const router = Router();

router.get("/me", protect, getMe);
router.get("/bulk", getUsers);
router.post("/update", protect, updateInfo);
router.post("/change-password", protect, changePassword);

export { router as userRouter };
