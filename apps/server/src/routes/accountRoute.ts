import { Router } from "express";
import {
  getBalance,
  transferBalance,
} from "../controllers/accountController.js";
import { protect } from "../controllers/authController.js";
const router = Router();

router.get("/balance", protect, getBalance);
router.post("/transfer", protect, transferBalance);

export { router as accountRouter };
