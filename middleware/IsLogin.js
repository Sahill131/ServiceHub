 import jwt from "jsonwebtoken";
 
 
 
 export default function islogin(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const data = jwt.verify(token, process.env.JWTSECRET);
    req.user = data;

    next();

  } catch (err) {
    return res.redirect("/login");
  }
}