const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        trim: true,
    },
    lastName: {
        type : String,
        require: true,
        trim: true,
    },
    email:{
        type: String,
        require: true,
        trim: true,
    },
    password:{
        type: String,
        require: true,
    },
    accountType: {
        type: String,
        emun: ["Admin"],
        require: true,
    },
    profileDetail:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Profile",
    },
    image:{
        type:String,
        require:true,
    },
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    },
},
{timestamps: true}
);

module.exports = mongoose.model("User", userSchema);