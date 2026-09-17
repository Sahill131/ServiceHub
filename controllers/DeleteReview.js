import reviewmodel from "../models/reviewsmodel.js";


const DeleteReview = async(req,res)=>{
    let revid = req.params.id;
     await reviewmodel.findByIdAndDelete({ _id: revid});

    res.redirect("/User/Reviews");




}

export default DeleteReview