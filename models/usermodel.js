const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/servicehub");

const userSchema = mongoose.Schema({

    name:String,
    surname:String,
    email:String,
    password:String,
    role:String,
    booking:[ { type:mongoose.Schema.Types.ObjectId, ref: "booking"}]
   
})

 module.exports= mongoose.model("user",userSchema)