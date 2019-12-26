const express= require('express');
const router= express.Router();
const middleware= require('../middleware/auth');
const user=require("../models/user");

router.use(middleware);

router.get('/',(req,res)=>{
    res.send({'ok':true, 'user':req.userId});
});

module.exports= app=>app.use('/users',router);