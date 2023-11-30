var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs")

//เรียก schema  
const Admin = require("../models/admin.schema")
const Partner = require("../models/partner.schema")
const Member = require("../models/member.schema");
const Contract = require('../models/contract.schema')
const adminAuth = require("../authentication/adminAuth")
//เรียกใช้ function เช็คชื่อและเบอร์โทรศัพท์
const checkalluser = require("../functions/check-alluser")


// api เพิ่มข้อมูล member
router.post("/member", async (req, res) => {
  try {
    const telephone = req.body.telephone
    const name = req.body.name
    //เช็คเบอร์ซ้ำ
    const Check = await checkalluser.Checktelephone(telephone).then((status)=>{
      return status
    })
    if(Check === true){
      return res.status(400).send({status:false,message:`เบอร์ ${telephone} ซ้ำ กรุณาเปลี่ยนใหม่`})
    }

    // รับค่า req 
    const Memberdata = new Member({
      telephone: telephone,
      password: bcrypt.hashSync(req.body.password, 10),
      name : req.body.name,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      roles: req.body.roles,
    });
    //เพิ่มข้อมูล
    await Memberdata.save().then(savedMember=>{
      return res.status(200).send({status:true,message:'บันทึกผู้ใช้เรียบร้อย(member)',data:savedMember});
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({status: false, message: error.message});
  }
});
//เพิ่มข้อมูล partner
router.post("/partner", async (req, res) => {
  try {
    const telephone = req.body.telephone
    const name = req.body.name
    //เช็คเบอร์ซ้ำ
    const Check = await checkalluser.Checktelephone(telephone).then((status)=>{
      return status
    })
    if(Check === true){
      return res.status(400).send({status:false,message:`เบอร์ ${telephone} ซ้ำ กรุณาเปลี่ยนใหม่`})
    }

    // รับค่า req 
    const Partnerdata = new Partner({
      telephone: telephone,
      password: bcrypt.hashSync(req.body.password, 10),
      name: req.body.name,
      idcard:req.body.idcard,
      address:req.body.address,
      tambon:req.body.tambon,
      amphure:req.body.amphure,
      province:req.body.province,
      level : req.body.level,
      email:req.body.email,
      bank:req.body.bank,
      numberbank:req.body.numberbank,
    });
    //เพิ่มข้อมูล
    const partner = await Partnerdata.save()
    const datacontract = new Contract({
      status: true,
      time: new Date(),
      signature: partner.name,
      message:`คุณ ${partner.name} ได้ยินยอมในสัญญาเรียบร้อยแล้ว`,
      partner_id: partner._id
    })
    const contract = await datacontract.save() 
    return res.status(200).send({status:true,message:'บันทึกผู้ใช้เรียบร้อย(Partner)',data:partner,contract:contract});
  } catch (error) {
    console.log(error);
    return res.status(500).send({status: false, message: error.message});
  }
});

//เพิ่มข้อมูล admin
router.post("/admin",adminAuth, async (req, res) => {
  try {
    const telephone = req.body.telephone
    //เช็คเบอร์ซ้ำ
    const Check = await checkalluser.Checktelephone(telephone).then((status)=>{
      return status
    })
    if(Check === true){
      return res.status(400).send({status:false,message:`เบอร์ ${telephone} ซ้ำ กรุณาเปลี่ยนใหม่`})
    }
    // รับค่า req 
    const Admindata = new Admin({
      telephone: telephone,
      password: bcrypt.hashSync(req.body.password, 10),
      name: req.body.name,
      roles : req.body.roles,
      level : req.body.level,
    });
    //เพิ่มข้อมูล
    await Admindata.save().then(savedAdmin=>{
      return res.status(200).send({status:true,message:'บันทึกผู้ใช้เรียบร้อย(admin)',data:savedAdmin});
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({status: false, message: error.message});
  }
});


module.exports = router;
