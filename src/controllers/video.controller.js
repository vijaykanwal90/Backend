// publishVideo
// getAllVideo
// getVideoById
// deleteVideo
// togglePUblishStatus
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Video} from "../models/video.model.js"
// import { channel} from "../middlewares/video.middleware.js"
// import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {mongoose} from "mongoose"
// import { response } from "express";
const publishAVideo = asyncHandler (async (req,res)=>{
// take a video
// get the video title and description
// console.log(req._id)
// const user = await User.findById(req._id);
// console.log(user)
const {title, description} = req.body
// const videos = await Video.find()
// console.log(videos)
if((title && description ) ===""){
    throw new ApiError(400,"provide the title and description")
}

const thumbnailLocalPath = req.files?.thumbnail[0].path
const videoLocalPath = req.files?.video[0].path
// console.log(thumbnailLocalPath)
if(!thumbnailLocalPath) {
    throw new ApiError(400,"no thumbnail")
}

if(!videoLocalPath){
    throw new ApiError(400,"no video")
}

const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
const videoFile = await uploadOnCloudinary(videoLocalPath)
// console.log(video.duration)
if(!thumbnail){
    throw new ApiError(400,"thumbnail not uploaded to databases")
}

if(!videoFile){
    throw new ApiError(400,"video not uploaded to databases")

}
const owner = await req.user?._id
    // console.log(owner)
    const username = await req.user?.username
// console.log(username)
// console.log(videoFile)
const video = await Video.create({
    title,
    description,
    thumbnail: thumbnail.url,
    videoFile: videoFile.url,
    duration:videoFile.duration,
    owner,
    username: req.owner.username

})
// console.log(video.title)
// console.log(video.isPublished)
// console.log(video.username)

})
 
const getAllVideo = asyncHandler(async (req,res)=>{
    const videos = await Video.find({owner: req.user?._id})
    
    // console.log(videos)
    // console.log("to get all videos routes")

    return res
    .status(200)
    .json(
         new ApiResponse(200,videos,"all videos fetched successfully")
    )

})

const getVideoById= asyncHandler(async (req,res)=>{
    const videoId = await req.user?._id
    // console.log(videoId)
    const videos = await Video.find({owner:videoId})
        
        
    
console.log(videos)
    // console.log(videos.length)
    if(videos.length==0){
        throw new ApiError(404," no video  found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,videos,"video by id is fetched succesfully")
    )
})

const deleteVideo = asyncHandler(async (req,res)=>{
 
    // console.log("video not found")
    const { videoId } = req.params
    // console.log(videoId)
    if (!mongoose.isValidObjectId(videoId)) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid videoId"));
      }
    const video  = await Video.findByIdAndDelete(videoId)
    // console.log(video)
    // console.log(video)
    return res
    .status(200)
    .json(
        new ApiResponse(200,video,"video by id is deleted succesfully")
    )

})

// const publishStatus = asyncHandler(async(req,res)=>{
//     const { videoId } =req.params
//     console.log(videoId)
//     const video  = await Video.findByIdAndUpdate(videoId,
        
//         {
//             $set:{
//                $isPublished: !($isPublished)
//             }
//         },
//         {new : true}

//         )

     
//     const publishedStatus = video.isPublished
//     console.log(!publishedStatus)
    
    
//  return res
//  .status(200)
//  .json(
//     new ApiResponse(200, video,"publish status toggled")
//  )

// })

export {
    publishAVideo,
    getAllVideo,
    getVideoById,
    deleteVideo,
    // publishStatus
}