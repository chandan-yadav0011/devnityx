const mongoose = require("mongoose");


const connectDB =async()=>{
    await mongoose.connect("mongodb+srv://devnityx:DUgYqZndtVz9QAdu@devnityx.ljqgiic.mongodb.net/devnityx");

};

module.exports = connectDB; 