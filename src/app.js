const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");


app.use(express.json());   // converts the json to javascript object


app.post("/signup",async(req,res)=>{

    try{
        const user = new User(req.body);
    
    await user.save();

    res.send("User added successfully")
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



