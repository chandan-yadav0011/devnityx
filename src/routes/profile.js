const express= require('express');
const router = express.Router();
const User = require('../models/user');
const userAuth = require('../middlewares/auth');
const bcrypt = require('bcrypt')
const { validateUpdateData,validatePasswordData } = require('../utils/validate');

router.get("/profile/view",userAuth,(req,res)=>{   

    try{    
        const user = req.user;
        res.status(200).send(user);
    }
    catch(err){
        res.status(400).send("Error "+ err.message);
    }
    
});

// router.patch("/update/:id",userAuth,async(req,res)=>{
//     const id = req.params.id;
//     const data= req.body;
//     try{

//         const ALLOWED_UPDATES= ["firstName","email", "password","lastName", "age", "photoUrl","skills","about"];
//         const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));  
        
//         if(!isUpdateAllowed) throw new Error("Update not allowed");
    
//         // const user = await User.findById(id);
//         // const userUpdated = await User.findByIdAndUpdate(id,data,{runValidators:true});
        
//         const result = await User.updateOne({_id:id},{$set:data},{runValidators:true});
//         if (result.matchedCount === 0)  return res.status(404).send("User not found");
//         if (result.modifiedCount === 0) return res.status(400).send("Nothing was updated.");
//         res.send("User updated successfully");
//     }
//     catch(err){
//         res.status(400).send("Something went wrong " + err.message);
//     }
// });

router.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
        if(!validateUpdateData(req)) throw new Error("Invalid edit request!");
        const userId = req.user._id;
        const data = req.body;

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
        await loggedInUser.save();
        // const updatedUser = await User.updateOne({_id : userId},{$set:data},{runValidators:true});
        
        // if(updatedUser.matchedCount===0) return res.status(404).send("User not found");
        // if(updatedUser.modifiedCount===0) return res.status(400).send("Nothing was updated");
        
        await loggedInUser.save()
        res.json({message:`${req.user.firstName} User updated successfully.`,
                    data:loggedInUser})
    }
    catch(err){
        res.status(400).send("Error "+ err.message);
    }
});


router.patch("/profile/password", userAuth,async(req,res)=>{
    try{
        validatePasswordData(req);
        const{newPassword} = req.body;
       
        const hashedPassword = await bcrypt.hash(newPassword,10);
         
        const {_id} = req.user._id; 

        const user = await User.findByIdAndUpdate({_id},{password:hashedPassword});

    
        res.json({
            message:"Password changed successfully",
            data: user
        })
    }
    catch(err){
        res.status(400).send("Error "+ err.message);
    }
    

    

});

module.exports= router;