import usermodel from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



const UserAuth = async (req, res) => {

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

            const token = jwt.sign({ email: email, role: user.role }, process.env.JWTSECRET);

           
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                expires: new Date(Date.now() + 7 * 60 * 60 * 1000) 

            })

           

            res.redirect("/")



        });



    });

}

export default UserAuth;