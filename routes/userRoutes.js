import express from "express";
import {
  registerUser,
  loginUser,
  userProfile,
  searchUsers,
  updateGameHistory,
  getLeaderBoard,
  updateAvatar,
} from "../controllers/userControllers.js";

import { authGuard } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/updateGameHistory", authGuard, updateGameHistory);
router.post("/updateAvatar", authGuard, updateAvatar);
router.get("/profile", authGuard, userProfile);
router.get("/getLeaderBoard", getLeaderBoard);
router.get("/searchUsers", authGuard, searchUsers);

export default router;
