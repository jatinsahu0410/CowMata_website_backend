const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.auth = async (req, res, next) => {
    try {
        // fetch token from req ki body
        console.log("token though cookie", req.cookies.token);
        console.log("Token body", req.body.token);
        console.log("Token Header: ", req.header("Authorization").replace("Bearer ", ""));
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        // if the token is missing 
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token is missing",
            });
        }

        // verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("printing the decoded payload", decode);
            req.user = decode;
        } catch (error) {
            console.log("error in verification", error);
            return res.status(401).json({
                success: false,
                message: "token is incorrect",
            });
        }
        next();
    } catch (error) {
        return res.status(501).json({
            success:false,
            message:"auth is unsuccssfull"
        })
    }
}