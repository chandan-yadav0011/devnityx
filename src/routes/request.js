const express= require('express');
const router= express.Router();
const userAuth= require('../middlewares/auth');
const ConnectionReq= require("../models/connectionReq");
const User = require("../models/user")

router.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const user = req.user;
        const fromUserId = user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested","ignored"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid Status Type: " +status});  
        }
      
        
        const toUser = await User.findById(toUserId);
        
  

        if(!toUser){
            return res.status(404).send({
                message : "User not found!"
            })
        }
        
        const existingConnectionReq = await ConnectionReq.findOne({
            $or:[
                {fromUserId, toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
        });

        if(existingConnectionReq){
            return res.status(400).send({
                message: "Connection Request Already Exists!!"
            });
        }


        const sendConnection = await ConnectionReq({
            toUserId,
            fromUserId,
            status
        });

        const data = await sendConnection.save();

    
        res.status(200).json({
            message: req.user.firstName + " is "+ status + " in " + toUser.firstName,
            data
        })
      
    }
    catch(err){
        res.status(400).send("Error: " +err.message);
    }
});

router.post("/request/review/:status/:requestId",userAuth, async(req,res)=>{
    
    try{
        const requestId = req.params.requestId;
        const status = req.params.status;
        const loggedInUser = req.user;

        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)) return res.status(400).json({message:"Invalid status"});

        const connectionRequest = await ConnectionReq.findOne({
            _id:requestId,
            toUserId:loggedInUser,
            status:"interested"
        })

        if(!connectionRequest){
            return res.status(404).json({message:"Connection request not found"});
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.status(200).json({
            message:"Connection request is "+ status,
            data
        })
    }
    catch(err){
        res.status(400).send("Error: "+ err.message);
    }
    
});

module.exports = router;