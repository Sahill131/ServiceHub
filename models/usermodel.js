import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/servicehub");

const userSchema = mongoose.Schema({

name:{
    type:String,
    required:[true,"name is required"]
},
    surname:{
        type:String,
        required:[true,"surname is required"]
    },
    email:{
        type:String,
        uique:true,
        required:[true,"email is required"]
    },
    password:{
        type:String,
    },
    role:{
        type:String,
        required:[true,"role is required"]
    },
    profilepic:{
        type:String,
        default:"default.jpg",
    },
     booking:[ { type:mongoose.Schema.Types.ObjectId, ref: "booking"}],
   
    review:[ { type:mongoose.Schema.Types.ObjectId, ref: "review"}],
    worker:[ { type:mongoose.Schema.Types.ObjectId, ref: "worker"}]

   
})

const usermodel = mongoose.model("user",userSchema)
 userSchema.index({ email: 1 });
 export default usermodel