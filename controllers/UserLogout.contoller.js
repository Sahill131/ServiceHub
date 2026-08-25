const UserLogout = (req, res) => {
  res.cookie("token", "")
  res.redirect("/login")

}

export default UserLogout