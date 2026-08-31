 import usermodel from "../models/usermodel.js";
 
 
 let pagination = async (req, res) => {

  let page = parseInt(req.query.page) || 1;
  let limit = 4;
  let skip = (page - 1) * limit;

  let users = await usermodel
    .find({ role: "User" })
    .populate("booking")
    .skip(skip)
    .limit(limit);

  let totalUsers = await usermodel.countDocuments({ role: "User" });

  let totalPages = Math.ceil(totalUsers / limit);

  res.render("admin", {
    users,
    currentPage: page,
    totalPages
  });
}

export default pagination;