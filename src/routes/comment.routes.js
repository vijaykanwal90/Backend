import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
   addComment,
   deleteComment,
   getVideoComment,
   updateComment
   

} from "../controllers/comment.controller.js"

import { Router } from "express"

const router = Router()
router.use(verifyJWT)
router.route("/:videoId").post(addComment)
router.route("/:videoId").get(getVideoComment)
router.route("/update/:commentId").post(updateComment)
router.route("/delete/:commentId").delete(deleteComment)

export default router