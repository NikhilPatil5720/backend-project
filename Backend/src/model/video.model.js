import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema= new Schema({
    videofile:{
        type:String,
        require:true,
    },
    thumbnail:{
        type:String,
        require:true,

    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    title:{
        type: String,
        require:true,

    },
    description:{
        type: String,
        require:true,
        
    },
    duration:{
        type: Number,
        require:true,
        
    },
    isPublish:{
        type: Boolean,
        default:true,
        
    },
    views:{
        type:Number,
        default:0,
    }



},{
    timestamps:true,
})
videoSchema.plugin(mongooseAggregatePaginate)
export const Video= mongoose.model("Video", videoSchema)