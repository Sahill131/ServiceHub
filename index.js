const express = require('express')
const app = express()
const mongoose = require("mongoose");

const path = require("path")
const usermodel = require("./models/usermodel.js");
const bookingmodel = require("./models/bookingmodel.js");
const reviewmodel = require("./models/reviewsmodel.js");
const workermodel = require("./models/wokermodel.js")

const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");


const upload = require("./config/multerconfig.js");
const console = require('console');
const strict = require('assert/strict');




app.use(cookieParser());

app.use(express.static('public'))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))


app.set('view engine', 'ejs')





app.post('/create', async (req, res) => {
  let { name, surname, email, password, role, } = req.body;
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

      var token = jwt.sign({ email: email, role: user.role }, 'shhhhh');



      res.cookie("token", token, {
        httpOnly: true
      })

      res.redirect("/")



    });



  });








})

app.post('/check', async (req, res) => {
  let { email, password } = req.body

  let user = await usermodel.findOne({ email })
  if (!user) return res.status(500).send("something went wrong")



  bcrypt.compare(password, user.password, function (err, result) {




    var token = jwt.sign({ email: email, role: user.role }, 'shhhhh');
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


function islogin(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const data = jwt.verify(token, "shhhhh");
    req.user = data;

    next();

  } catch (err) {
    return res.redirect("/login");
  }
}



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

function isAdmin(req, res, next) {
  if (!req.user) {

    res.redirect("/login");
  }

  if (req.user.role !== "admin") {

    res.send("Access Denied ");
  }

  next();
}



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




function isWorker(req, res, next) {
  if (req.user.role !== "worker") {
    res.send("Acess denied")
    res.redirect("/worker/login")
  }

  next()
}


app.get("/worker/dashboard", islogin, async (req, res) => {
  let workers = await bookingmodel.find({ worker: req.user._id }).populate("user")
 

 

  let wokersemail = await workermodel.findOne({ email: req.user.email }).populate("booking")
  res.render("workerdashboard", { workers, wokersemail ,})
})


app.listen(4000, () => {
  console.log("Server running on port 4000")
})
