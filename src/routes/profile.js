const express= require('express');
const router = express.Router();
const User = require('../models/user');
const userAuth = require('../middlewares/auth');

router.get("/profile",userAuth,(req,res)=>{   

    try{    
        const user = req.user;
        res.status(200).send(user);
    }
    catch(err){
        res.status(400).send("Error "+ err.message);
    }
    
});

router.patch("/update/:id", userAuth,async(req,res)=>{
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
});

module.exports= router;