import mongoose from "mongoose"



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

const bookingmodel = mongoose.model("booking",bookingSchema)
export default bookingmodel