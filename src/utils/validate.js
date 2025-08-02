const validator = require("validator")

const validateSignUpData = (req)=>{
    const {firstName,lastName,email,password}= req.body;
    
    if(!firstName || !lastName) throw new Error("Name is not valid");
    else if(!validator.isEmail(email)) throw new Error("Invalid email id");
    else if(!validator.isStrongPassword(password)) throw new Error("Please enter a strong Password");
}

const validateLoginData = (req)=>{
    const{email, password} = req.body;
    if(!validator.isEmail(email)) throw new Error("Invalid email");
    else if(!password) throw new Error("Password is not valid");

}
module.exports = {validateSignUpData, validateLoginData};   