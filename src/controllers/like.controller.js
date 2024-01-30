import { Like } from "../models/like.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"

const toggleCommentLike = asyncHandler (async (req,res)=>{
    const {commentId} = req.params

    const likeComment= await Like.create({

        $set:{
            
        }
    })
})

export {
    toggleCommentLike
}
// todo
// toggleCommentLike,
//     toggleTweetLike,
//     toggleVideoLike,
//     getLikedVideos

