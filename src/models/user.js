const mongoose = require("mongoose");
const validate = require("validator");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validate.isEmail(value))  throw new Error("Invalid email "+ value)
        }
    },
    password:{
        type:String,
        required:true,
        minLength:8,
        minLowercase:1,
        minUppercase:1,
        minSymbols:1,
        validate(value){
            if(!validate.isStrongPassword(value))  throw new Error("Enter a Strong password ");
        }
    },
    gender:{
        type:String,
        enum:{
            values:["Male","Female","Others"],
            message:`{VALUE} is invalid`
        }
    },
    age:{
        type:Number,
        
    },
    photoUrl:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCpY5LtQ47cqncKMYWucFP41NtJvXU06-tnQ&s",
        validate(value){
            if(!validate.isURL(value)) throw new Error("Invalid photo URL")
        }
    },
    about:{
        type:String,
        default:"This is a default about the user."
    },
    skills:{
        type:[String]
    },
    isPremium:{
        type:Boolean,
        default:false,
    },
    membershipType:{
        type:String,
    }
         
},{timestamps:true});


userSchema.methods.getJWT = async function(){
    const user = this;

    const payload = {
        userId: user._id
    }
    const token = await jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1d"});
    return token;
};

userSchema.methods.validatePassword = async function(password){
    const user = this;
    const verifyPassword = await bcrypt.compare(password,user.password);

    return verifyPassword;
}

module.exports = mongoose.model("User",userSchema);