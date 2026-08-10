const mongoose=require("mongoose");



const bookingSchema = mongoose.Schema({

    name:String,
    email:String,
    service:String,
    date:String,
    time:String,
    addres:String,
    Status:{
        type:String,
        default:"Pending"
    },



    worker:[ { type:mongoose.Schema.Types.ObjectId, ref: "worker"}],
    user:[ { type:mongoose.Schema.Types.ObjectId, ref: "user"}]
})

 module.exports= mongoose.model("booking",bookingSchema)