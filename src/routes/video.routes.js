import { Router } from "express";

import {
    publishAVideo,
    getAllVideo
} from "../controllers/video.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.route("/upload").post(verifyJWT,upload.fields([
    {
        name:"thumbnail",
        maxCount:1
    },
    {
        name:"video",
        maxCount:1
    }
]),publishAVideo)
 
router.route("/allVideos").get(getAllVideo)
export default router