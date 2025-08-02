const express = require('express');
const router = express.Router();
const {validateSignUpData,validateLoginData} = require("../utils/validate");
const bcrypt = require("bcrypt");
const User = require('../models/user');

router.post("/signup",async(req,res)=>{  

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

router.post("/login",async(req,res)=>{
    
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

module.exports = router;