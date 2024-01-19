// publishVideo
// getAllVideo
// getVideoById
// deleteVIdeo
// togglePUblishStatus
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const publishAVideo = asyncHandler (async (req,res)=>{
// take a video
// get the video title and description
// console.log(req._id)
const user = await User.findById(req._id);
console.log(user)
const {title, description} = req.body

if((title && description ) ===""){
    throw new ApiError(400,"provide the title and description")
}

const thumbnailLocalPath = req.files?.thumbnail[0].path
const videoLocalPath = req.files?.video[0].path
console.log(thumbnailLocalPath)
if(!thumbnailLocalPath) {
    throw new ApiError(400,"no thumbnail")
}

if(!videoLocalPath){
    throw new ApiError(400,"no video")
}

const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
const video = await uploadOnCloudinary(videoLocalPath)
// console.log(video.duration)
})
 
const getAllVideo = asyncHandler(async (req,res)=>{

})

export {
    publishAVideo
}