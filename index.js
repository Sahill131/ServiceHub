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


import upload from "./utils/multerconfig.js";
import islogin from "./middleware/IsLogin.js"
import isAdmin from "./middleware/IsAdmin.js"
import IsWorker from "./middleware/IsWorker.js"
import isUser from "./middleware/IsUser.js"

import "dotenv/config";

import sendEmail from "./utils/NodeMailer.js";


import UserAuth from "./controllers/user.control.js"
import UserLogin from "./controllers/UserLogin.control.js"
import UserLogout from "./controllers/UserLogout.contoller.js"
import Booking from "./controllers/Booking.js"
import pagination from "./controllers/Pagination.js"




app.use(cookieParser());

app.use(express.static('public'))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))


app.set('view engine', 'ejs')




app.post('/create', UserAuth)

app.post('/check', UserLogin)


app.get('/logout', UserLogout)

app.get('/profile', islogin, isUser, async (req, res) => {

  let user = await usermodel.findOne({ email: req.user.email, role: "User" }).populate("booking").populate("review")



  res.render("profile", { user })





})



app.get("/admin", islogin, isAdmin, pagination);






app.post('/booking', islogin, Booking)

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

  const idd = await bookingmodel.findOne({ _id: id }).populate("user")
  idd.Status = "Accepted"
  await idd.save()

 

  await sendEmail({
  to: idd.user[0].email,
  subject: "🎉 Your ServiceHub Booking Has Been Accepted!",

  html: `
  <!DOCTYPE html>
  <html>
    <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">

      <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.08);">

        <!-- Header -->
        <div style="background:#111111; padding:30px; text-align:center;">
          <h1 style="color:#ffffff; margin:0; font-size:28px;">
            ServiceHub
          </h1>
          <p style="color:#bbbbbb; margin:8px 0 0;">
            Your trusted service platform
          </p>
        </div>

        <!-- Content -->
        <div style="padding:40px 30px; color:#333333;">

          <!-- Success Icon -->
          <div style="text-align:center; margin-bottom:20px;">
            <div style="
              width:65px;
              height:65px;
              line-height:65px;
              background:#e8f5e9;
              border-radius:50%;
              margin:auto;
              font-size:32px;
            ">
              ✓
            </div>
          </div>

          <h2 style="text-align:center; margin-bottom:10px;">
            Booking Accepted!
          </h2>

          <p style="font-size:16px; line-height:1.6;">
            Hello <strong>${idd.user[0].name}</strong>,
          </p>

          <p style="font-size:16px; line-height:1.6;">
            Great news! 🎉 Your service booking has been successfully
            <strong>accepted</strong> by the service provider.
          </p>

          <!-- Status Box -->
          <div style="
            background:#f7f7f7;
            border-left:4px solid #111111;
            padding:18px;
            margin:25px 0;
            border-radius:6px;
          ">
            <p style="margin:0 0 8px;">
              <strong>Booking Status:</strong>
            </p>

            <span style="
              display:inline-block;
              background:#111111;
              color:#ffffff;
              padding:7px 16px;
              border-radius:20px;
              font-size:13px;
              font-weight:bold;
            ">
              ACCEPTED
            </span>
          </div>

          <p style="font-size:16px; line-height:1.6;">
            The service provider will take care of the next steps. You can
            visit your ServiceHub profile to keep track of your booking.
          </p>

          <!-- Button -->
          <div style="text-align:center; margin:30px 0;">
            <a href="http://localhost:4000/profile"
              style="
                display:inline-block;
                background:#111111;
                color:#ffffff;
                text-decoration:none;
                padding:14px 28px;
                border-radius:6px;
                font-weight:bold;
              ">
              View My Booking
            </a>
          </div>

          <p style="font-size:15px; color:#666; line-height:1.6;">
            Thank you for choosing ServiceHub. We're committed to making
            your service experience simple and reliable.
          </p>

        </div>

        <!-- Footer -->
        <div style="
          background:#111111;
          padding:20px;
          text-align:center;
          color:#999999;
          font-size:13px;
        ">
          <p style="margin:0;">
            © 2026 ServiceHub. All rights reserved.
          </p>
          <p style="margin:8px 0 0;">
            Connecting people with trusted service professionals.
          </p>
        </div>

      </div>

    </body>
  </html>
  `,

});

console.log("Email sent successfully to:", idd.user[0].email);



  res.redirect("/worker/dashboard")

})


app.get('/worker/reject/:id', async (req, res) => {

  const id = req.params.id;

  const idd = await bookingmodel.findOne({ _id: id })
  idd.Status = "Cancel"
  await idd.save()

  await sendEmail({
  to: idd.user[0].email,
  subject: "Update Regarding Your ServiceHub Booking",

  html: `
  <!DOCTYPE html>
  <html>
    <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">

      <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.08);">

        <!-- Header -->
        <div style="background:#111111; padding:30px; text-align:center;">
          <h1 style="color:#ffffff; margin:0; font-size:28px;">
            ServiceHub
          </h1>

          <p style="color:#bbbbbb; margin:8px 0 0;">
            Your trusted service platform
          </p>
        </div>


        <!-- Content -->
        <div style="padding:40px 30px; color:#333333;">

          <!-- Status Icon -->
          <div style="text-align:center; margin-bottom:20px;">
            <div style="
              width:65px;
              height:65px;
              line-height:65px;
              background:#f5f5f5;
              border-radius:50%;
              margin:auto;
              font-size:32px;
              color:#555;
            ">
              !
            </div>
          </div>


          <h2 style="text-align:center; margin-bottom:10px;">
            Booking Update
          </h2>


          <p style="font-size:16px; line-height:1.6;">
            Hello <strong>${idd.user[0].name}</strong>,
          </p>


          <p style="font-size:16px; line-height:1.6;">
            We regret to inform you that your service booking could not be
            accepted by the service provider at this time.
          </p>


          <!-- Status Box -->
          <div style="
            background:#f7f7f7;
            border-left:4px solid #555555;
            padding:18px;
            margin:25px 0;
            border-radius:6px;
          ">

            <p style="margin:0 0 8px;">
              <strong>Booking Status:</strong>
            </p>

            <span style="
              display:inline-block;
              background:#555555;
              color:#ffffff;
              padding:7px 16px;
              border-radius:20px;
              font-size:13px;
              font-weight:bold;
            ">
              NOT ACCEPTED
            </span>

          </div>


          <p style="font-size:16px; line-height:1.6;">
            Don't worry — you can explore other trusted service professionals
            on ServiceHub and find the right expert for your needs.
          </p>


          <!-- CTA -->
          <div style="text-align:center; margin:30px 0;">
            <a href="http://localhost:4000/worker"
              style="
                display:inline-block;
                background:#111111;
                color:#ffffff;
                text-decoration:none;
                padding:14px 28px;
                border-radius:6px;
                font-weight:bold;
              ">
              Explore Other Services
            </a>
          </div>


          <p style="font-size:15px; color:#666; line-height:1.6;">
            We apologize for any inconvenience caused. Thank you for choosing
            ServiceHub, and we hope to help you find the right service provider soon.
          </p>

        </div>


        <!-- Footer -->
        <div style="
          background:#111111;
          padding:20px;
          text-align:center;
          color:#999999;
          font-size:13px;
        ">
          <p style="margin:0;">
            © 2026 ServiceHub. All rights reserved.
          </p>

          <p style="margin:8px 0 0;">
            Connecting people with trusted service professionals.
          </p>
        </div>

      </div>

    </body>
  </html>
  `,
});


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
    return res.status(409).send("Already Register")
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

      let token = jwt.sign({ email: email, role: workers.role, _id: workers._id }, process.env.JWTSECRET)
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict"
      })
      return res.redirect("/")
    })

  })
})


app.post('/login', async (req, res) => {
  let { email, password } = req.body

  let worker = await workermodel.findOne({ email: email })
  if (!worker) return res.status(500).send("something went wrong")



  bcrypt.compare(password, worker.password, function (err, result) {




    var token = jwt.sign({ email: email, role: worker.role, _id: worker._id }, process.env.JWTSECRET);
    res.cookie("token", token, {
      httpOnly: true
    })


    res.redirect("/")

  });
})




app.get("/worker", async (req, res) => {

  let worker = await workermodel.find()
  res.render("worker", { worker })

}
)







app.get("/worker/dashboard", islogin, IsWorker, async (req, res) => {

  let workers = await bookingmodel.find({ worker: req.user._id }).populate("user")
  let wokersemail = await workermodel.findOne({ email: req.user.email }).populate("booking")
  res.render("workerdashboard", { workers, wokersemail, })

})


const PORT = Number(process.env.PORT) || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
