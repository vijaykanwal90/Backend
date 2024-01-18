import { Router } from "express";

import {
    publishAVideo
} from "../controllers/video.controller.js"

const router = Router()
router.route("/upload").post(publishAVideo)

export default router