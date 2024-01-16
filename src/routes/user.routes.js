import { Router } from "express";
import { loginUser, logoutUser, registerUser , refreshAccessToken , dashBoard , updateUserAvatar, changeCurrentPassword } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount:1
        },
        {
            name: "coverImage",
            maxCount:1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)
// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/dashBoard").post(verifyJWT,dashBoard)
router.route("/updateUserAvatar").post(upload.single('avatar') ,updateUserAvatar)
router.route("/changeCurrentPassword").post(verifyJWT,changeCurrentPassword)

export default router