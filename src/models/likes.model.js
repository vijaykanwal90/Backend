import mongoose , {Schema} from 'mongoose';
 
const likesSchema = new Schema({
 comment:{
    type:Schema.Types.ObjectId,
    ref:"Comment"
 },
video:{
    type:Schema.Types.ObjectId,
    ref:"Video"
},
likedBy:{
    type:Schema.Types.ObjectId,
    ref:"User"
},
tweet:{
    type:Schema.Types.ObjectId,
    ref:"Tweet"

}

},
    
    
    {timestamp:true});

export const Likes = mongoose.model("Likes",likesSchema)