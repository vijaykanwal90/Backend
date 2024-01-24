import { Comment } from "../models/comment.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { mongoose } from "mongoose"
// import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"
import { JSONCookie } from "cookie-parser"

const addComment = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;
    const user = req.user?._id.toString();
    const { videoId } = req.params;
console.log(content)
    if (content.trim() === "") {
      throw new ApiError(400, "Comment cannot be empty");
    }

    const comment = await Comment.create({
      content,
      video: videoId,
      owner: user,
    });

    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle Mongoose validation errors
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        errors: validationErrors,
      });
    } else {
      // Handle other types of errors
      return res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Internal Server Error",
      });
    }
  }
});

const getVideoComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  if (!videoId) {
    throw new ApiError(400, "video on found")
  }
  const getComments = await Comment.find({ video: videoId })
  if (!getComments) {
    throw new ApiError(400, "comment not found")

  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, getComments, "comments fetched succesfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
  const {commentId} = req.params;
  const { content } = req.body;
  // taking data as form is not encoded that is why content is undefined so try to send data as raw or through url-concoded way
  console.log(content)
  if(!content){
    throw new ApiError(400,"comment not defined")
  }
  if(commentId.trim()==""){
    throw new ApiError(400,"comment id not found in the params");
  }
  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
        $set:{

            content
         }
    },
    {
        new:true
    }
  )
  if (!comment){
    throw new ApiError(400,"no comment  found of login user ");
  }
  return res.status(200).json(new ApiResponse(200,comment,"comment updated successfully"));
});

const deleteComment = asyncHandler(async (req,res)=>{
  const {commentId } = req.params
  if(!commentId) {
    throw new ApiError(500, "comment not found")
  }

     const comment = await Comment.findByIdAndDelete(commentId)
if(!comment){
  throw new ApiError(200,"comment not deleted")
}
  return res
  .status(200)
  .json(
    new ApiResponse(200,"comment deleted successfully")
  )
  
})

export {
  addComment,
  getVideoComment,
  updateComment,
  deleteComment
}


// to do 
// getVideoComments, 
// addComment, 
// updateComment,
//  deleteComment