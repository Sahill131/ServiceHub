function isUser(req, res, next) {



  if ( req.user.role !== "User") {
    res.send("acess denied")
  }
  next()
}

export default isUser