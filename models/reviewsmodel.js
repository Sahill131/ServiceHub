const mongoose=require("mongoose");



const reviewSchema = mongoose.Schema({

    name:String,
    review:String,


    user:[ { type:mongoose.Schema.Types.ObjectId, ref: "user"}]
})

 module.exports= mongoose.model("review",reviewSchema)