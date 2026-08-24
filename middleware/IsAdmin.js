 export default function isAdmin(req, res, next) {
  if (!req.user) {

    res.redirect("/login");
  }

  if (req.user.role !== "admin") {

    res.send("Access Denied ");
  }

  next();
}