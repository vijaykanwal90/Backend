import { lowerCase, uniq } from "lodash";
import { Mongoose, Schema } from "mongoose";
const playlistSchema = new Schema({
    name:{
        type:"String",
        required:true,
        lowerCase:true,
        unique:true
    },
    description:{
        type:"String",
        required:true,
        lowerCase:true,
    },
    videos:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
},

{timestamps:true})
   

export const Playlist = mongoose.model("Playlist",playlistSchema)