 export default function isWorker(req, res, next) {
  if (req.user.role !== "worker") {
   return res.status(403).render("access-denied");
    res.redirect("/worker/login")
  }

  next()
}