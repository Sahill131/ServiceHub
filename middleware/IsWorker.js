 export default function isWorker(req, res, next) {
  if (req.user.role !== "worker") {
    res.send("Acess denied")
    res.redirect("/worker/login")
  }

  next()
}