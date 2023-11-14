const User = require("../models/User");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
    try {
        // data fetch from body 
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
        } = req.body;
        // validation of data
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "please first fill all the details",
            })
        }
        // dono password ko match karo 
        if (password !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "password doesn't match",
            });
        }
        // check the user already exsist or not 
        const checkExistingUser = await User.findOne({ email });
        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: "the user already exist! please go to login page",
            })
        }

        // hash the password
        let hashedPasssword;
        try {
            hashedPasssword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error in hashing Password',
            })
        }

        // firstly need to make the profile 
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            contactNumber: null,
        });

        // create usring in the db;
        const userDetails = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPasssword,
            accountType,
            profileDetail: profileDetails.__id,
            image: `https://api.dicebear.com/6.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        // res
        return res.status(200).json({
            success: true,
            message: "signup successfull",
            userDetails
        })
    } catch (error) {
        console.log("error in sign up", error);
        return res.status(400).json({
            success: false,
            message: "something wents wrong in sign up"
        })
    }
}


// login handler 
exports.login = async (req, res) => {
    try {
        // fetch the data 
        const { email, password } = req.body;
        // validation of daat 
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the required details",
            });
        }
        // check if the user registered or not 
        const userData = await User.findOne({ email }).populate("profileDetail");
        // if user not found
        if (!userData) {
            return res.status(401).json({
                success: false,
                message: "please first register yourself",
            });
        }

        // check for password
        if (await bcrypt.compare(password, userData.password)) {
            // make the payload
            const payload = {
                email: userData.email,
                id: userData._id,
                accountType: userData.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "3d"
            });
            userData.token = token;
            // undefine the password
            userData.password = undefined;
            //  creating options for cookie
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60),
                httpOnly: true,
            }
            // create the cookie
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                userData,
                message: "cookie has been successfully created, login is successfull",
            })
        } else {
            return res.status(401).json({
                success: false,
                message: "password is incorrect",
            });
        }
    } catch (error) {
        console.log("error occured in login", error);
        return res.status(400).json({
            success: false,
            message: "something wents wrong in login",
        })
    }
}