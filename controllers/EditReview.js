import reviewmodel from "../models/reviewmodel.js";
const EditReview = async (req, res) => {
    let { reviewname, reviwes } = req.body;
    let id = req.params.id;
    let edit = await reviewmodel.FindOne({ _id: id })
    edit.name = reviewname;
    edit.review = reviwes;
    await edit.save();
    res.redirect("/User/Reviews");


}

export default EditReview   