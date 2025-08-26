const express= require("express");
const userAuth = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constant");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");
const router = express.Router();

router.post("/payment/create",userAuth, async(req,res)=>{
    
    try{
       
        const{firstName,lastName,email}= req.user;
        const {membershipType} = req.body;
    

        const order = await razorpayInstance.orders.create({
            amount: membershipAmount[membershipType]*100,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            receipt: "order_rcptid_11",
            notes:{
                firstName:firstName,
                lastName: lastName,   
                email: email,
                membershipType:membershipType,
            },
            payment_capture:1
        });

        //Save the payment info in database
        //console.log(order);

        const payment = new Payment({
            userId: req.user._id,
            amount: order.amount,
            status: order.status,
            order_Id: order.id,
            currency:order.currency,
            receipt:order.receipt,
            notes:order.notes

        })

        const savedPayment = await payment.save();
        console.log(savedPayment);

        //Return the order details to frontend
        res.json({...savedPayment.toJSON(),keyId: process.env.RAZORPAY_KEY_ID});

    }
    catch(err){
        res.status(500).json({msg: err.message});
    }
});

router.post("/api/payment/webhook", async(req,res)=>{
    try{
        const webhookSignature = req.get("X-Razorpay-Signature");

        const isWebhookValid = validateWebhookSignature(    // if the source is not valid then this becomes invalid
            JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET
        );

        if(!isWebhookValid) return res.status(400).json({msg:"Webhook signature is invalid"});

        //here we have to update the payment status in db.
        
        const paymentDetails = req.body.payload.payment.entity;

        const payment = await Payment.findOne({order_Id:paymentDetails.order_Id});

        payment.status= payment.status;

        await payment.save();
        
        //update the user as premium

        const user = await User.findOne({_id:payment.userId});

        user.isPremium = true;

        user.membershipType= payment.notes.membershipType;

        await user.save();

        // if(req.body.event=='payment.captured'){

        // }

        // if(req.body.event=="payment.failed"){
            
        // }


        //return status 200 message to the webhook or else it will keep calling this untill it receives 200 status.
        return res.status(200).json({msg:"Webhook received successfully"});
        


    }
    catch(err){
        return res.status(500).json({msg:err.message});
    }
});
module.exports = router;