import { Router } from "express";

import {
    publishAVideo,
    getAllVideo,
    getVideoById,
    deleteVideo,
    // publishStatus
} from "../controllers/video.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { verifyChannel } from "../middlewares/video.middleware.js";
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
router.use(verifyJWT);
router.route("/allVideos").get(getAllVideo)
router.route("/VideoById").get(getVideoById)
router.route("/c/:videoId").get(deleteVideo)
// router.route("/c/publishStatus/:videoId").get(verifyJWT,publishStatus)

export default router