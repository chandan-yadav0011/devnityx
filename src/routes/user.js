const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionReq = require("../models/connectionReq");
const User = require("../models/user");


const USER_SAFE = "firstName lastName age gender skills about photoUrl"
// get all the pending connection request received for the loggedIn user.
router.get("/user/requests/received", userAuth, async(req, res)=>{
   try{
      
        const loggedInUser = req.user;
      
        const connections = await ConnectionReq.find({
            toUserId:loggedInUser._id,
            status: "interested"
        }).populate("toUserId",USER_SAFE).populate("fromUserId",USER_SAFE);

     
       
        if(!connections) throw new Error("No pending connections")

        res.status(200).json({
            message: "All connections of "+ loggedInUser.firstName + " founded successfully",
            data: connections
        });
   }
   catch(err){
    res.status(400).send("Error: "+ err.message);
   }

}); 

router.get("/user/connections", userAuth , async(req,res)=>{
    try{
        const loggedInUser = req.user;

        const connections  = await ConnectionReq.find({
            status:"accepted",
            $or:[
                {toUserId:loggedInUser._id},
                {fromUserId:loggedInUser._id}
            ]
        }).populate("toUserId",USER_SAFE).populate("fromUserId",USER_SAFE);

        const data = connections.map((row)=>{
            if(row.toUserId._id.toString()===loggedInUser._id.toString()) return row.fromUserId;
            else return row.toUserId;
        })


        res.status(200).json({
            message: "Connections of " + loggedInUser.firstName + " founded successfully",
            data: data
        })

    }
    catch(err){
        res.status(400).send("Error: "+ err.message);
    }
});

router.get("/user/feed", userAuth, async(req,res)=>{
   try{
        const loggedInUser = req.user;
        const page  = parseInt(req.query.page)||1;
        let limit = parseInt(req.query.limit)||10;
        limit =limit>50?50:limit;
        //const feed = await User.find();


        const connections  = await ConnectionReq.find({
            $or: [
                {toUserId: loggedInUser._id},
                {fromUserId: loggedInUser._id}
            ]
        });

/*
        ****************************************************MY APPROACH*******************************************

        const data = feed.filter((user)=> user._id.toString()!==loggedInUser._id.toString())

        const finalData = data.map((user)=>{
            const res = connections.some((conn)=>(conn.toUserId.toString()===user._id.toString()))|| connections.some((conn)=>(conn.fromUserId.toString()===user._id.toString()))
            
            return (!res && user);
        })
        
        const d =finalData.filter(d=>d!==false);   
*/

        const hideUserFromFeed = new Set();

        connections.forEach((req) => { 
            hideUserFromFeed.add(req.toUserId.toString());
            hideUserFromFeed.add(req.fromUserId.toString());
        });
 
        const user = await User.find({
            $and:[
                {_id: {$nin:Array.from(hideUserFromFeed)}},
                {_id :{$ne:loggedInUser._id}}
            ]
        })
        .select(USER_SAFE)
        .skip((page-1)*limit)
        .limit(limit); 

      //  console.log(user);
        res.status(200).json({
            message: "Feed of "+ loggedInUser.firstName,
            data: user,
        });
   }
   catch(err){          
        res.status(400).send("Error: "+ err.message);
   }
    
});

module.exports = router;