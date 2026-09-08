import usermodel from "../models/usermodel.js";
const Userreviews =async(req,res)=>{
    const  user = await usermodel.findOne({email:req.user.email}).populate("review")
    res.render("reviews", { user });

    
    
}

export default Userreviews