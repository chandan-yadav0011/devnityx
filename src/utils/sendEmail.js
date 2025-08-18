const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress,subject,body)=>{
    return new SendEmailCommand({
        Destination:{
            // required
            CcAddresses:[
                // more items
            ],
            ToAddresses:[
                toAddress,
                // more To-email address
            ],
        },
        Message:{
            // required
            Body:{
                // required
                Html:{
                    Charset:"UTF-8",
                    Data:`<h1>${body}</h1>`
                },
                Text:{
                    Charset:"UTF-8",
                    Data:"This is the text format email"
                },

            },
            Subject:{
                Charset:"UTF-8",
                Data: subject
            }
        },
        Source: fromAddress,
        ReplyToAddresses:[
            // 
        ]
    })
};

const run = async(subject, body)=>{
    const sendEmailCommand = createSendEmailCommand(
        "chandanyadav8145@gmail.com",
        "support@devnityx.social",
        subject,
        body
    ); 

    try{ 
        return await sesClient.send(sendEmailCommand);
    }
    catch(caught){
        if(caught instanceof Error && caught.name === "MessageRejected"){
            const messageRejectedError= caught;
            return messageRejectedError;
        }
        throw caught;
    }
};

module.exports= {run};