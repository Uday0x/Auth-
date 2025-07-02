import express from "express"
import { getMe, loginUser, logout, registerUser, verifyUser } from "../controller/user.controller.js"
import { isLoggedIn } from "../middleware/auth.middleware.js"

const router = express.Router()


router.post("/register",registerUser)
router.get("/verify/:token" ,verifyUser)
router.get("/login",loginUser)
router.get("/profile",isLoggedIn,getMe)
router.get("/logout",isLoggedIn,logout)

export default router