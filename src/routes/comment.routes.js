import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
   commentOnVideo
   

} from "../controllers/comment.controller.js"

import { Router } from "express"

const router = Router()
router.use(verifyJWT)
router.route("/:videoId").post(commentOnVideo)

export default router