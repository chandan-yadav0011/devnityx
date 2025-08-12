const cron = require("node-cron");
const connectionReq = require("../models/connectionReq");
const {subDays, startOfDay, endOfDay} = require("date-fns");


//This job will run at 8:00 am everyday which will notify every user who have pending requests via email
cron.schedule('0 8 * * *',async()=>{

    try{

        const yesterday = subDays(new Date(),1)
        console.log(yesterday);

        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingReq = await connectionReq.find({
            status:"interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }

        }).populate("fromUserId toUserId");

        const listOfEmails = [...new Set(pendingReq.map((req)=>req.toUserId.email))];

        for(const email of listOfEmails){
            //send emails
            try{
                const res = await sendEmail.run(
                    "New Friend Requests pending for "+ email,
                    "There are so many friend requests pending, please login to Devnityx.in and accept or reject"
                );
                console.log(res);
            }
            catch(err){
                console.log(err);
            }
        }
    }
    catch(err){
        console.error(err);
    }
    console.log("hello world",+ new Date());
})