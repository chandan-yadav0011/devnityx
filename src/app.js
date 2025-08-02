const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignUpData,validateLoginData} = require("./utils/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const userAuth = require('./middlewares/auth');
app.use(express.json());   // converts the json to javascript object
app.use(cookieParser());

app.post("/signup",async(req,res)=>{

    try{
        //Data validation at API level. 
        validateSignUpData(req);

        //Encrypting the password.
        const {firstName,lastName,password,email,gender} = req.body;
        const hashedPassword = await bcrypt.hash(password,10)
       
        const user = new User({
            firstName,
            lastName,
            password:hashedPassword,
            email,
            gender
        });

        //Saving to DB 
        await user.save();

    res.send("User added successfully")
    }
    catch(err){
        res.status(400).send("Something went wrong "+ err.message);    
    }   
   
});

app.post("/login",async(req,res)=>{
    
    try
    {
        // validate
        validateLoginData(req);

        //find user with that creadentials
        const {email,password}= req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(404).send("User not found!");

        //dcrypt the password and compare it with entered password 
        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid) {   
            //create JWT token
          

            const token = await user.getJWT();
          //  console.log(token);
            
            //Add the token to cookie and send the response back to user.
            res.cookie("token",token,{expires:new Date(Date.now()+360000*24)});
            res.status(200).send("User Logged in successfully.");

        }
        else{
            throw new Error("Incorrect Password.")
        }   
        
        // send respond 
       

    }
    catch(err){
        res.status(400).send("Something went wrong "+ err.message);
    } 
});

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

app.get("/profile",userAuth,async(req,res)=>{   

    try{    
        const user = req.user;
        res.status(200).send(user);
    }
    catch(err){
        res.status(400).send("Error "+ err.message);
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

app.patch("/update/:id", async(req,res)=>{
    const id = req.params.id;
    const data= req.body;
   
    
    try{

        const ALLOWED_UPDATES= ["firstName","email", "password","lastName", "age", "photoUrl","skills","about"];
        const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));  
        
        if(!isUpdateAllowed) throw new Error("Update not allowed");
    
        // const user = await User.findById(id);
        // const userUpdated = await User.findByIdAndUpdate(id,data,{runValidators:true});
        
        const result = await User.updateOne({_id:id},{$set:data},{runValidators:true});
        if (result.matchedCount === 0)  return res.status(404).send("User not found");
        if (result.modifiedCount === 0) return res.status(400).send("Nothing was updated.");
        res.send("User updated successfully");
    }
    catch(err){
        res.status(400).send("Something went wrong " + err.message);
    }
})

connectDB()
 .then(()=>{
    console.log("Database connected successfully...");
    app.listen(8000,()=>{
        console.log("Server listening on Port 8000");
    })
 })
 .catch((err)=>{
    console.log("Database connection failed!!!");
 });



