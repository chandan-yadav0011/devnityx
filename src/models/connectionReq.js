const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required:true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    status:{
        type: String,
        enum: {
            values: ["accepted","rejected","ignored","interested"],
            message:`{VALUES} is incorrect status type`
        }
    }
},{
    timestamps:true
});

connectionRequestSchema.index({fromUserId:1, toUserId:1});

connectionRequestSchema.pre("save", function(next){
    const connectionReq= this;
    
    if(connectionReq.fromUserId.equals(connectionReq.toUserId)){
       
        throw new Error("Cannot send connection request to yourself!");
    }

    next();
})

module.exports = new mongoose.model("ConnectionReq",connectionRequestSchema);