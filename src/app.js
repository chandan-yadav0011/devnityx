const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const User = require("./models/user.js");


app.post("/signup",async(req,res)=>{
    const user = new User({
        firstName:"Chandan",
        lastName:"Yadav",
        email:"chandanyadav8145@gmail.com",
        password:"Password@123",
        age:22,
        gender:"Male"
    });

    await user.save();

    res.send("User added successfully.");
});


connectDB()
.then(()=>{

    console.log("Database connected successfully...");
    app.listen(8000,()=>{
        console.log("Server listening on Port 8000.");
    });
    })
.catch((err)=>{
    console.log("Database connection failed!!");
});


