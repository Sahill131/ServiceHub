const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  visit: {
    type: Number,
    required: true
  },

  service: {
    type: String,
    required: true
  },

  experience: {
    type: Number,
    default: 0
  },

  location: {
    type: String,
    required: true
  },

  job: {
    type: Number,
    default: 0
  },

  role:{
    type:String,
    default:"worker"
  },

  description: {
    type: String
  },

  profilepic:{
    type:String,
    default:"wdefault.jpeg"
  },

  booking:[ { type:mongoose.Schema.Types.ObjectId, ref: "booking"}],

}, {
  timestamps: true
});
 


module.exports = mongoose.model("Worker", workerSchema);
