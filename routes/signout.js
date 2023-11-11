var express = require("express");
var router = express.Router();

//const Session = require('../models/session.schema');
//const jwt = require('jsonwebtoken');


router.get('/', async(req,res)=>{
  try {
    await req.session.destroy()
    res.status(200).send({message :"log out สำเร็จ"})
  } catch (error) {
    return res.status(500).send({status:false,error:error.message});
  }
});


module.exports = router;
