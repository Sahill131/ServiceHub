const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/servicehub");

const userSchema = mongoose.Schema({

    name:String,
    surname:String,
    email:String,
    password:String,
    role:String,
    profilepic:{
        type:String,
        default:"default.jpg",
    },
     booking:[ { type:mongoose.Schema.Types.ObjectId, ref: "booking"}],
   
    review:[ { type:mongoose.Schema.Types.ObjectId, ref: "review"}],
    worker:[ { type:mongoose.Schema.Types.ObjectId, ref: "worker"}]

   
})

 module.exports= mongoose.model("user",userSchema)
 userSchema.index({ email: 1 });