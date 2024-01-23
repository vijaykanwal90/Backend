import { Comment} from "../models/comment.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import {mongoose} from "mongoose"
import { User } from "../models/user.model.js"
import {Video } from "../models/video.model.js"
const commentOnVideo = asyncHandler (async (req,res)=>{
          const {content} = req.body
          console.log(content)
          const user = req.user?._id
          console.log(user)
          const videoId = req.params
          if(content.trim()==""){
            throw new ApiError(400,"comment cant be empty")
          }
          const comment  = await Comment.create({
            content: content,
            video:videoId,
            owner: user
            
          })
          if(!comment){
            console.log("error")
            throw new ApiError(300, "unable to create comment collection in database")
          }
          return res
          .status(200)
          .json(
            new ApiResponse(200,comment,"comment added succefully")
          )
})

export {
    commentOnVideo
}