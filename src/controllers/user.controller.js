import { asyncHandler } from "../utils/asyncHandler.js";
import { APiError, ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { APiResponse  } from "../utils/ApiResponse.js";
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
    const { username, email, fullname } = req.body;

    console.log("email", email);
    // if(fullname === ""){
    //     throw new ApiError( 400 , "Fullname is required")
    // }
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "ALl fields are required")
    }
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new APiError(409, "User with email or username already exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log(avatarLocalPath)
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    console.log(coverImageLocalPath);
    if (!avatarLocalPath) {
        throw new APiError(400, "avatar fle is required")
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
    if(!createdUser ){
        throw new ApiError(500,"Something wenwrong whil registering the user")
    }
return res.status(201).json(
    new APiResponse (200,createdUser, "User registered successfully")
)
})

export { registerUser }