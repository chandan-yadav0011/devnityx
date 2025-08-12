const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use(express.json());   // converts the json to javascript object
app.use(cookieParser());

require("dotenv").config();

app.use(cors({
    origin: "http://localhost:5173",
    credentials:true,   
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));



const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require("./routes/user");



app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);   


app.get("/feed",async(req,res)=>{
    const feed = await User.find();
    try{
        if(feed.length==0){
            res.status(404).send("No feed available");
        }
        else{
            res.status(200).send(feed);
        }
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})


//get user by a particular email id

app.get("/user",async(req,res)=>{
    const emailId = req.body.email;
   
   
    try{
        const user = await User.findOne();
        if(user===null){
            res.status(404).send("No user found!");
        }
        else{
            res.status(200).send(user);
        }
    }
    catch(err){
    
        res.status(400).send("Error: " + err.message)
    }
})

app.delete("/delete",async(req,res)=>{
    const id= req.body.id;
    try{
        const user = await User.findByIdAndDelete(id);
        if(user===null) res.send("User doesn't exists");
        else res.status(200).send("User deleted successfully");
    }
    catch(err){
        res.status(400).send("Bad request.");
    }
 
});

connectDB()
 .then(()=>{
    console.log("Database connected successfully...");
    app.listen(process.env.PORT,()=>{
        console.log("Server listening on Port 8000");
    })
 })
 .catch((err)=>{
    console.log("Database connection failed!!!");
 });



