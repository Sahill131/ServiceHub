
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import usermodel from "../models/usermodel.js"

const UserLogin = async (req, res) => {
    let { email, password } = req.body

    let user = await usermodel.findOne({ email })
    if (!user) return res.status(500).send("something went wrong")



    bcrypt.compare(password, user.password, function (err, result) {




        var token = jwt.sign({ email: email, role: user.role }, process.env.PORT);
        res.cookie("token", token, {

        })

        res.redirect("/")

    }
    )
}
export default UserLogin