const express = require('express')
const app = express()
app.use(express.static('public'))
const path = require("path")
const usermodel = require("./models/usermodel.js");
const bookingmodel = require("./models/bookingmodel.js");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");


app.use(cookieParser()); // ✅ important

app.use(express.json())

app.use(express.urlencoded({ extended: true }))


app.set('view engine', 'ejs')





app.post('/create', async (req, res) => {
  let { name, surname ,email, password, role,  } = req.body;
  let user = await usermodel.findOne({ email });
  if (user) return res.status(500).send("already registred")


  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {

      let user = await usermodel.create({
        name,
        surname,
        email,
        password: hash,
        role,
      })

      var token = jwt.sign({ email: email }, 'shhhhh');
      res.cookie("token", token)

      res.redirect("/")

     

    });



  });








})

app.post('/check', async (req, res) => {
  let { email, password } = req.body

  let user = await usermodel.findOne({ email })
  if (!user) return res.status(500).send("something went wrong")



  bcrypt.compare(password, user.password, function (err, result) {




    var token = jwt.sign({ email: email }, 'shhhhh');
    res.cookie("token", token)

    res.redirect("/")

  });
})


app.get('/logout', (req, res) => {
  res.cookie("token", "")
  res.redirect("/")

})

app.get('/profile', islogin, async (req, res) => {
  // let {email}=req.body
  let user = await usermodel.findOne({ email: req.user.email }).populate("booking")
 
  // res.render("profile",{ user })

  res.render("profile", { user })

  

})

app.get("/admin", async (req, res) => {
    let users = await usermodel.find().populate("booking")

    res.render("admin", { users })
})

function islogin(req, res, next) {
  if (req.cookies.token === "") res.redirect("/login")
  else {
    let data = jwt.verify(req.cookies.token, "shhhhh")
    req.user = data;
    next();
  }
}




app.post('/booking',islogin,  async (req, res) => {

  let user= await usermodel.findOne({email:req.user.email})
  let {name,email,service,date,time,addres}=req.body
  let booking=await bookingmodel.create({
    user:user._id,
    name,
    email,
    service,
    date,
    time,
    addres,




    

   
  })
  user.booking.push(booking._id);
   await user.save()

  //  res.redirect("/profile")
  res.redirect("/profile")

})

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/register', (req, res) => {
  res.render('register')
})


app.listen(4000, () => {
  console.log("Server running on port 3000 😎🔥")
})
