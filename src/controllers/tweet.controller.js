import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Tweet} from "../models/tweet.model.js"
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const createTweet = asyncHandler(async (req,res)=>{
    const user = req.user?._id
    const { content } = req.body
    if(content.trim()===""){
        throw new ApiError(400,"tweet can't be empty")
    }
    const tweet = await Tweet.create(
        {
            content,
            owner: user
        }
    )
    if(!tweet){
        throw new ApiError(500,"Iternal error sorry tweet can't be  made")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,tweet,"tweet made succesfully")
    )
})

const getUserTweets = asyncHandler(async (req,res)=>{

    const user = req.user?._id
    console.log(user)
    if(!user){
        throw new ApiError(400, "user not found")
    }
    const tweets = await Tweet.find({owner:user})
    if(!tweets){
        throw new ApiError(400, "no tweets found for this user")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, tweets,"tweets fetched succesfully")
    )

})

const updateTweet = asyncHandler(async (req,res)=>{
  
    const {tweetId} = req.params
    if(!tweetId){
        throw new ApiError(400, "tweet not found")
    }

const {content} = req.body
if(content.trim()===""){
    throw new ApiError(400, "content can not be empty")
}
    const tweet = await Tweet.findByIdAndUpdate(tweetId,{

        $set:{
              content:content
        }
    },
    {new: true})

    return res
    .status(200)
    .json(
        new ApiResponse(200,tweet,"tweet updated successfully")
    )
})

const deleteTweet = asyncHandler(async (req,res)=>{

    const {tweetId} = req.params
    if(!tweetId){
        throw new ApiError(400, "tweet not found")
    }
    const tweet = await Tweet.findByIdAndDelete(tweetId)
    if(!tweet){
        throw new ApiError(400, "tweet cannot be deleted")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,"tweet deleted successfully")
    )
})

export {
createTweet,
getUserTweets,
updateTweet,
deleteTweet

}

// todo
// createTweet,
// getUserTweets,
// updateTweet,
// deleteTweet