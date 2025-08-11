const validator = require("validator")

const validateSignUpData = (req)=>{
    const {firstName,lastName,email,password}= req.body;
    
    if(!firstName || !lastName) throw new Error("Name is not valid");
    else if(!validator.isEmail(email)) throw new Error("Invalid email id");
    else if(!validator.isStrongPassword(password)) throw new Error("Please enter a strong Password");
};

const validateLoginData = (req)=>{
    const{email, password} = req.body;
    if(!validator.isEmail(email)) throw new Error("Invalid email");
    else if(!password) throw new Error("Password is not valid");

};

const validateUpdateData = (req)=>{
    //const {firstName, lastName, gender, age,photoURL}= req.body;
    const ALLOWED_UPDATES = ["firstName","lastName","gender","skills","age","photoUrl","about"];
    const data = req.body;
   
    const isUpdateAllowed  = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));

    return isUpdateAllowed;
    // if(!firstName) throw new Error("Invalid First Name");
    // if(!lastName) throw new Error("Invalid Last Name");
    // if(!gender) throw new Error("Invalid gender");
    // if(!age|| age<=0) throw new Error("Invalid age");
    // if(!validator.isURL(photoURL)) throw new Error("Invalid photoURL");
};

const validatePasswordData = async (req)=>{
    const {oldPassword, newPassword} = req.body;
    const user = req.user;
    
    const verifyPassword = await user.validatePassword(oldPassword);
    if(!verifyPassword) throw new Error("Incorrect Password!");

    if(!validator.isStrongPassword(newPassword)) throw new Error("Enter a Strong password");

    return;

}



module.exports = {validateSignUpData, validateLoginData,validateUpdateData,validatePasswordData};   