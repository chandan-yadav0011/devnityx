const jwt = require("jsonwebtoken");
const User = require('../models/user');


const userAuth = async(req, res,next)=>{

    try{
        const {token} = req.cookies; 
        if(!token) throw new Error("Token not valid!");
        const decodedMessage = await jwt.verify(token,"Devnityx$12");
        const {userId} = decodedMessage;

        const user = await User.findById(userId);

        if(!user) throw new Error("User not found");

        req.user= user;
        next();
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }

}


module.exports = userAuth;