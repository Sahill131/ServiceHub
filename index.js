import express from "express"
const app = express()


import path from "path"
import usermodel from "./models/usermodel.js";
import bookingmodel from "./models/bookingmodel.js";
import reviewmodel from "./models/reviewsmodel.js";
import workermodel from "./models/wokermodel.js"

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";


import upload from "./config/multerconfig.js";
import islogin from "./middleware/IsLogin.js"
import isAdmin from "./middleware/IsAdmin.js"
import IsWorker from "./middleware/IsWorker.js"
const JWTSCRECT = process.env.JWTSCRECT ;
import dotenv from"dotenv";
dotenv.config()




app.use(cookieParser());

app.use(express.static('public'))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))


app.set('view engine', 'ejs')




app.post('/create', UserAuth)

app.post('/check', async (req, res) => {
  let { email, password } = req.body

  let user = await usermodel.findOne({ email })
  if (!user) return res.status(500).send("something went wrong")



  bcrypt.compare(password, user.password, function (err, result) {




    var token = jwt.sign({ email: email, role: user.role }, process.env.PORT);
    res.cookie("token", token, {

    })

    res.redirect("/")

  });
})


app.get('/logout', (req, res) => {
  res.cookie("token", "")
  res.redirect("/login")

})

app.get('/profile', islogin, isUser, async (req, res) => {

  let user = await usermodel.findOne({ email: req.user.email, role: "User" }).populate("booking").populate("review")
  console.log(user)


  res.render("profile", { user })





})



app.get("/admin", islogin, isAdmin, async (req, res) => {

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
});






app.post('/booking', islogin, async (req, res) => {

  let user = await usermodel.findOne({ email: req.user.email })

  let { name, email, service, date, time, addres } = req.body
  let worker = await workermodel.findOne({ service: service })
  let booking = await bookingmodel.create({
    user: user._id,
    name,
    email,
    service,
    date,
    time,
    addres,
    worker: worker._id,







  })
  worker.booking.push(booking._id)
  user.booking.push(booking._id);
  await user.save()
  await worker.save()

  

  res.redirect("/")

})

app.get('/', async (req, res) => {
  let user = await usermodel.find({ role: "User" }).populate("review")
  res.render('index', { user })
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.get('/admin/login', (req, res) => {
  res.render('adminlogin')
})





app.post("/user/reviews", islogin, async (req, res) => {

  let user = await usermodel.findOne({ email: req.user.email })
  let { reviewname, reviews } = req.body;


  let r = await reviewmodel.create({
    user: user._id,
    name: reviewname,
    review: reviews,









  })
  user.review.push(r._id);
  await user.save()

  res.redirect("/profile")

})


app.get('/worker/accept/:id', async (req, res) => {

  const id = req.params.id;

  const idd = await bookingmodel.findOne({ _id: id })
  idd.Status = "Accepted"
  await idd.save()
  res.redirect("/worker/dashboard")

})


app.get('/worker/reject/:id', async (req, res) => {

  const id = req.params.id;

  const idd = await bookingmodel.findOne({ _id: id })
  idd.Status = "Cancel"
  await idd.save()
  res.redirect("/worker/dashboard")

})

app.get('/admin/complete/:id', async (req, res) => {

  const id = req.params.id;

  const idd = await bookingmodel.findOne({ _id: id })
  idd.Status = "Completed"
  await idd.save()
  res.redirect("/admin")

})




app.get("/profile/uplaod", islogin, (req, res) => {
  res.render("profilepic")
})

app.post("/uplaods", islogin, upload.single("images"), async (req, res) => {
  let users = await usermodel.findOne({ email: req.user.email })
  users.profilepic = req.file.filename;

  await users.save()
  res.redirect("/profile")


})

app.get("/worker/register", (req, res) => {
  res.render("workerregister")
})

app.get("/worker/login", (req, res) => {
  res.render("workerlogin")
})



app.post("/worker/create", islogin, async (req, res) => {
  let { name, email, password, service, location, experience, job, visit, price, description } = req.body;

  let worker = await workermodel.findOne({ email: email })
  if (worker) {
    res.statusCode(500).send("Already Register")
  }

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {

      let workers = await workermodel.create({
        name,
        email,
        password: hash,
        experience,
        description,
        visit,
        price,
        location,
        job,
        service,
        role: "worker",

      })

      let token = jwt.sign({ email: email, role: workers.role, _id: workers._id }, 'shhhhh')
      res.cookie("token", token, {
        httpOnly: true,
        sameSite:"strict"
      })
      res.redirect("/")

      res.statusCode(200).json({
        message:"all good",
        data:workers
      })
    })

  })
})


app.post('/login', async (req, res) => {
  let { email, password } = req.body

  let worker = await workermodel.findOne({ email: email })
  if (!worker) return res.status(500).send("something went wrong")



  bcrypt.compare(password, worker.password, function (err, result) {




    var token = jwt.sign({ email: email, role: worker.role, _id: worker._id }, 'shhhhh');
    res.cookie("token", token, {
      httpOnly: true
    })


    res.redirect("/")

  });
})


function isUser(req, res, next) {



  if (req.user.role !== "admin" && req.user.role !== "User") {
    res.send("acess denied")
  }
  next()
}


app.get("/worker", islogin, async (req, res) => {

  let worker = await workermodel.find()
  res.render("worker", { worker })

}
)







app.get("/worker/dashboard", islogin, async (req, res) => {
  let workers = await bookingmodel.find({ worker: req.user._id }).populate("user")
 

 

  let wokersemail = await workermodel.findOne({ email: req.user.email }).populate("booking")
  res.render("workerdashboard", { workers, wokersemail ,})
})


app.listen(4000, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
