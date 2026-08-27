 
 import bookingmodel from "../models/bookingmodel.js"
 import usermodel from "../models/usermodel.js"
 import workermodel from "../models/wokermodel.js"
 
 const Booking = async (req, res) => {

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

}

export default Booking