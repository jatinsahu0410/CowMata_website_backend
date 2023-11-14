const mongoose = require("mongoose");

const donatorSchema = new mongoose.Schema({
    donatorName:{
        type: String,
        require: true,
    },
    emailId : {
        type:  String,
    },
    donatorContactNumber: {
        type: Number,
        trim : true,
    },
    donationAmount: {
        type: Number,
        require: true,
    },
    donatorMessage: {
        type : String,
        require: true,
    },
},
{timestamps: true}
);

module.exports = mongoose.model("Donator", donatorSchema);