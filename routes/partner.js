const express = require('express');
const router = express.Router();

// ตรวจสอบสมาชิก
const adminAuth = require('../authentication/adminAuth')
const paramsAuth = require('../authentication/partnerAuth')
// schema
const Admin = require("../models/admin.schema")
const Partner = require("../models/partner.schema")
const Member = require("../models/member.schema");
const bcrypt = require("bcryptjs")
//เรียกใช้ function เช็คชื่อและเบอร์โทรศัพท์
const checkalluser = require("../functions/check-alluser")

const jwt = require("jsonwebtoken");


//เรียกข้อมูลทั้งหมด
router.get('/',adminAuth, async(req,res)=>{
    try{
        const partnerdata = await Partner.find()
        if(!partnerdata){
            return res.status(404).send({status:false,message:"ไม่มีข้อมูล partner"})
        }
        return res.status(200).send({status:true,data:partnerdata})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
})

//ค้นหา partner ตาม token
router.get('/findpartner/',paramsAuth.onlypartner, async (req,res)=>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        const decoded =  jwt.verify(token,secretKey)
        // ทำการดึงข้อมูลadmin
        const partner = await Partner.findOne({name:decoded.name})
        return res.status(200).send({status:true,data:partner})
    }
    catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
})


//ค้นหาข้อมูลเฉพาะ id
router.get('/:id',paramsAuth.verifyTokenpartner, async(req,res)=>{
    try{
        const id = req.params.id
        const partnerdata = await Partner.findOne({_id:id})

        if(!partnerdata){
            return res.status(404).send({status:false,message:"หาข้อมูลไม่เจอ partner"})
        }
        return res.status(200).send({status:true,data:partnerdata})
    }
    catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
})

//อนุมัติ ข้อมูลการเป็นpartner
router.put('/approve/:id',adminAuth, async(req,res)=>{
    try{
        const id = req.params.id
        const newStatus = {
            statusapprove: 'อนุมัติ',
            timestamps: new Date()
          };
          
        const approvepartner = await Partner.findByIdAndUpdate({ _id: id },{ $push: { approve: newStatus},status:true ,statusbooking:true},{ new: true })
        if(!approvepartner){
            return res.status(404).send({status:false,message:"id ที่ส่งมาไม่มีในข้อมูล partner"})
        }
        return res.status(200).send({status:true,message:`ข้อมูล ${approvepartner.name} ได้รับการอนุมัติ`,update:approvepartner})

    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
})

//ไม่อนุมัติ ข้อมูลการเป็นpartner
router.put('/unapprove/:id',adminAuth, async(req,res)=>{
    try{
        const id = req.params.id
        const newStatus = {
            statusapprove: 'ไม่อนุมัติ',
            timestamps: new Date()
          };

        const approvepartner = await Partner.findByIdAndUpdate({ _id: id },{ $push: { approve: newStatus } },{ new: true })
        if(!approvepartner){
            return res.status(404).send({status:false,message:"id ที่ส่งมาไม่มีในข้อมูล partner"})
        }
        return res.status(200).send({status:true,message:`ข้อมูล ${approvepartner.name} ไม่ได้รับอนุมัติ`,update:approvepartner})

    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
})


//แก้ไขข้อมูล partner
router.put('/:id',paramsAuth.onlypartner, async(req,res)=>{
    try{
        const id = req.params.id
        const checkofpartner = await Partner.findOne({_id:id})
        const telephone = req.body.telephone
        const password = ( req.body.password!= undefined && req.body.password!=""? bcrypt.hashSync(req.body.password, 10):checkofpartner.password)
        const name = req.body.name
        const image_idcard = (req.body.image_idcard!= undefined && req.body.image_idcard!= "" ? req.body.image_idcard:checkofpartner.image_idcard)
        //เช็คเลขซ้ำ  
        if(!checkofpartner){
            return res.status(400).send({status:false,message:`หาข้อมูลไม่เจอ`})
        }
        //ถ้าหา เบอร์โทรศัพท์ เหมือนกับที่ ส่งมาแสดงว่าตัวเดียวกัน
        if(telephone != checkofpartner.telephone)
        {
            const Check = await checkalluser.Checktelephone(telephone).then((status)=>{return status})
            if(Check === true){
                return res.status(400).send({status:false,message:`เบอร์${telephone}ซ้ำ กรุณาเปลี่ยนใหม่`})
            }
        }
        ////ถ้าหา เบอร์โทรศัพท์ เหมือนกับที่ ส่งมาแสดงว่าตัวเดียวกัน
        if(name != checkofpartner.name){
            const Checkname = await Admin.findOne({name:name})
            if(Checkname){
                return res.status(400).send({status:false,message:`ชื่อ ${name} ซ้ำ กรุณาเปลี่ยนใหม่`})
            }
        }
        const companyname = req.body.companyname
        const level = req.body.level
        const partnerdata = {
            telephone: telephone,
            password :password,
            name : name,
            idcard:req.body.idcard,
            image_idcard:image_idcard,
            address:req.body.address,
            tambon:req.body.tambon,
            amphure:req.body.amphure,
            province:req.body.province,
            level : level
        }
        const editpartner = await Partner.findByIdAndUpdate(id,partnerdata,{ new: true })
        if(!editpartner){
            return res.status(404).send({status:false,message:"id ที่ส่งมาไม่มีในข้อมูล partner"})
        }
        return res.status(200).send({status:true,message:`อัพเดทข้อมูล ${editpartner.name} สำเร็จ`,update:editpartner})

    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
})

//ลบข้อมูล partner
router.delete('/:id',adminAuth, async(req,res)=>{
    try{
        const id = req.params.id
        const checkofpartner = await Partner.findOne({_id:id})
        if(!checkofpartner)
        {
            return res.status(404).send({status:false,message:"หาข้อมูลไม่เจอ partner"})
        }
        const deletepartner = await Partner.deleteOne({_id:id})
        if(deletepartner){
            return res.status(200).send({status:true,message:"ลบข้อมูล partner สำเร็จ"})
        }
    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
})

//เพิ่มรูป partner
const {uploadFileCreate,deleteFile} = require('../functions/uploadfilecreate');
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
     //console.log(file.originalname);
  },
});

router.post('/picture/:id',async(req,res)=>{
    try{
        const id = req.params.id;
        const partner = await Partner.findById(id);
        if(!partner){
            return res.status(404).send(`partner id ${id} not found`);
        }
        let upload = multer({ storage: storage }).array("imgCollection", 20);
        upload(req, res, async function (err) {
            const reqFiles = [];
            const result=[];
            if (!req.files) {
                res.status(400).send({ message: "ไม่ได้ส่งภาพมา", status: false });
            } else {
                const url = req.protocol + "://" + req.get("host");
                for (var i = 0; i < req.files.length; i++) {
                const url =  await uploadFileCreate(req.files, res, { i, reqFiles });
                result.push(url);
                //   reqFiles.push(url + "/public/" + req.files[i].filename);
                }
                let edit = ""
                if(result){
                    const data = partner.image_idcard.concat(reqFiles);
                    edit = await Partner.findByIdAndUpdate(id,{image_idcard:data},{returnOriginal:false})
                    res.status(201).send({
                        message: "สร้างรูปภาพเสร็จเเล้ว",
                        status: true,
                        partner:edit,
                        file: reqFiles,
                        result:result,
                    });
                }else{
                    return res.status(404).send({message:`อัพเดทข้อมูลล้มเหลว`});
                }
            }
          })
    }catch(error){
        return res.status(500).send(error);
    }
       
})
router.delete('/:id/picture/:image_idcard',async(req,res)=>{
    const partnerid = req.params.id;
    const pictureid = req.params.image_idcard;

    try {
  
    const partner = await Partner.findById(partnerid);
  
    if(!partner){
        return res.status(404).send(`partner ${partnerid} not found`);
    }
    await deleteFile(pictureid);
    const updatedata = partner.image_idcard.filter(image => image !== pictureid)
    const edit = await Partner.findByIdAndUpdate(partnerid,{image_idcard:updatedata},{returnOriginal:false})
    return res.status(200).send({message:"ลบภาพสำเร็จแล้ว",partner:edit})
  
    } catch (error) {
      return res.status(500).send(error);
    }
})

//เปิด-ปิด การทำรายการไอดี partner ได้
router.put('/statusbooking/:id',adminAuth,async(req,res)=>{
    const id = req.params.id
    const partner = Partner.findById(id)
    if(!partner)
    {
        return res.status(404).send(`partner ${id} not found`);
    }
    const edit = await Partner.findByIdAndUpdate(id,{statusbooking:true},{returnOriginal:false})
    return res.status(200).send({message:`เปิดได้ไอดีpartner ${id} `,partner:edit})
})

router.put('/unstatusbooking/:id',adminAuth,async(req,res)=>{
    const id = req.params.id
       const partner = Partner.findById(id)
    if(!partner)
    {
        return res.status(404).send(`partner ${id} not found`);
    }
    const edit = await Partner.findByIdAndUpdate(id,{statusbooking:false},{returnOriginal:false})
    return res.status(200).send({message:`ปิดได้ไอดีpartner ${id} `,partner:edit})
})



module.exports = router;