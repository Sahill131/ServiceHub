const usermodel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWTSCRECT = process.env.JWTSCRECT;


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

            var token = jwt.sign({ email: email, role: user.role }, JWTSCRECT);



            res.cookie("token", token, {
                httpOnly: true
            })

            res.redirect("/")



        });



    });

}

export default UserAuth;