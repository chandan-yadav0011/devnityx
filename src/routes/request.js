const express= require('express');
const router= express.Router();
const userAuth= require('../middlewares/auth');

router.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    const user = req.user;
    //sending connection req.

    res.status(200).send("Sended connection request successfully.");
});

module.exports = router;