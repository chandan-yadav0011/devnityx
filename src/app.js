const express = require("express");
const app = express();

app.get('/',(req,res)=>{
    res.send("hello devnityx namaste ji")
})

app.get('/',(req,res)=>{
    res.send("Namaste use!")
})


app.listen(3000,()=>{
    console.log("Listening on PORT: 3000...");
})
