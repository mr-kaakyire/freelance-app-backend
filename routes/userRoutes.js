import express from "express";
import { getAllPartners, getSeller, loginUser, registerUser,searchPartners,updateProfile,updateProfilePicture,userProfile,payPartner } from "../controllers/userControllers.js";
import { authGuard } from "../middleware/authMiddleware.js";




const router=express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile",authGuard,userProfile);
router.put("/updateProfile",authGuard,updateProfile);
router.put("/updateProfilePicture", authGuard,updateProfilePicture);
router.get("/getAllPartners",getAllPartners);
router.get("/getSeller",authGuard,getSeller);
router.get("/searchPartners",authGuard,searchPartners);
router.post("/payPartner",authGuard,payPartner)


export default router;