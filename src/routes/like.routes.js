import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleCommentLike } from "../controllers/like.controller.js";


const router = Router()

router.use(verifyJWT)
router.route("/commentLike/:commentId").put(toggleCommentLike)