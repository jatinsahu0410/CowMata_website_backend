// taking the instance of express
const express = require("express");
const app = express();
require("dotenv").config();

const cookieParser = require("cookie-parser");
const cors = require("cors");
// middleware
app.use(express.json());
app.use(cookieParser());
// to entertain THE req of front end
app.use(
    cors({
        // origin:"http://localhost:3000",
        origin:"*",
        credentials:true,
    })
);

// connection to mongo db
const db = require("./config/database");
db.connectdb();

// port number of server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>{
    console.log(`App is running at ${PORT}`);
})