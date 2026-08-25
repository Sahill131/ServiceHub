import mongoose from "mongoose"



const reviewSchema = mongoose.Schema({

    name:{
        type:String,
        required:[true,"name is required"]
    },
    review:{
        type:String,
        required:[true,"review is required"]
    },


    user:[ { type:mongoose.Schema.Types.ObjectId, ref: "user"}]
})

const reviewmodel = mongoose.model("review",reviewSchema)
export default reviewmodel  