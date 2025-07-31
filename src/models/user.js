const mongoose= require("mongoose");

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
        trim:true
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    gender:{
        type:String,
        validate(value){
            if(!["Male","Female","Others"].includes(value)){
                throw new Error("Gender data invalid!");
            }
        }
    },
    age:{
        type:Number,
        min:18
    },
    photoUrl:{
        type:String,
        default:"https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
    },
    about:{
        type:String,
        default:"This is a default about the user."
    },
    skills:{
        type:[String]
    },
         
},{timestamps:true});

module.exports = mongoose.model("User",userSchema);