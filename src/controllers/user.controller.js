import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        console.log(user)
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        //  because save methods invokes all the methods of db means it requires all the fields thats why false here no need to validate

        return { accessToken, refreshToken }
    }
    catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //   asking for a username email, and password and then save it to the database 
    // then validation of user details
    // check user already exist or not through username and email
    // check for images, check for avataar
    // upload them to cloudnaryn, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return response 
    // const {fullname, email, username, password} = req.body 
    const { username, email, fullname, password } = req.body;

    console.log("email", email);
    // if(fullname === ""){
    //     throw new ApiError( 400 , "Fullname is required")
    // }
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log(avatarLocalPath)
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // console.log(coverImageLocalPath);
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar fle is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) {
        throw new ApiError(400, "avatar fle is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Something wenwrong whil registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})


const loginUser = asyncHandler(async (req, res) => {
    // req-body se data
    // to login need username or email password, 
    // find the user through user_id
    // check the password
    // then need access token and refresh token
    // send cookie
    // and response for succesfull
    // const {email, username, password} = req.body
    const { email, username, password } = req.body
    // console.log(email)
    // console.log(password)
    // console.log(username)
    // console.log(username)
    if (!(username || email)) {
        throw new ApiError(400, "username or password is required")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
        // $or is mongodb operator
    })
    if (!user) {
        throw new ApiError(404, "User does not exit")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credential")
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


    const options = {
        // as httpOnly true only this can be modified thorugh backend
        httpOnly: true,
        secure: true
    }


    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, {
                user: loggedInUser, accessToken,
                refreshToken
            },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
            // $unset: {
            //     refreshToken: 1
            // }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    console.log(incomingRefreshToken)
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "invalid refresh token")

        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: false
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken }
                    , "AcessToken refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
    }
})


const dashBoard = asyncHandler(async (req, res) => {
    //     const accessToken = req.cookies?.accessToken || req.body.accessToken
    //     const refreshToken = req.cookies?.refreshToken || req.body.refreshToken

    //     if(!accessToken){
    //         throw new ApiError(401,"login first ")
    //     }
    //  const user = await User.findOne(req.user._id)
    // //  console.log(user._id)
    //  const userDetails = await User.findById(user._id).select("-password -refreshToken")
    return res.status(201).json(
        new ApiResponse(200, req.user, "User dashboard")
    )
    //  console.log(user)
    //   get the access token
    // go to dashboard route
    // take the access token 
    // verify the access token 
    // then get the user id 
    // then display the user information 
    // if invalid access token then display login first information

})



const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id)
    console.log(user.avatar)
    console.log(user)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new Error("invalid old password")


    }
    user.password = newPassword
    await user.save({ validateBeforeSave: false })
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfuly"))


})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "current User fetched succesfully")
        )
})


const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body
    if (!(fullname || email)) {
        throw new ApiError(400, "all fields are required")
    }
    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                fullname,
                email: email,

            }
        },
        { new: true }) //information after update is return due to tru
        .select("-password")
    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    console.log(avatarLocalPath)
    const useravatar = await User.findById(req.user?._id)
    console.log(useravatar.email)

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar file is missing")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(400, "error while uploading on avatar")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, "avatar image update succesfully")
        )

})


const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "cover image file is missing")
    }
    const coverImage = await uploadOnCloudinary(avatarLocalPath)
    if (!coverImage.url) {
        throw new ApiError(400, "error while uploading on cover image")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, "cover image update succesfully")
        )

})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        }, {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $conditiion: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1

            }
        }
    ])
    console.log(channel)
    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,channel[0],"user channel fetched succesfully")
    )
})

const getWatchHistory = asyncHandler(async (req,res)=>{
    const user  = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localfield:"owner",
                            foreignField:"_id",
                            as :"owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                       $addFields:{
                        owner:{
                            $first:"$owner"
                        }
                       } 
                    }
                ]
            }
        }
    ])
    return res
    .status(200)
    .json(
        new ApiResponse(200, user[0].watchHistory,"watch history fetched successfully" )
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    dashBoard,
    getCurrentUser,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}