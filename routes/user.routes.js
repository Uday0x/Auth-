import express from "express"
import { forgotPassowrd, getMe, loginUser, logout, registerUser, resetPassword, verifyUser } from "../controller/user.controller.js"
import { isLoggedIn } from "../middleware/auth.middleware.js"

const router = express.Router()


router.post("/register",registerUser)
router.get("/verify/:token" ,verifyUser)
router.get("/login",loginUser)
router.get("/profile",isLoggedIn,getMe)
router.get("/logout",isLoggedIn,logout)
router.post("/forgotPassowrd",forgotPassowrd)
router.get("/resetPassword/:token",resetPassword )

export default router