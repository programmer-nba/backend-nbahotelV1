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
          
        const approvepartner = await Partner.findByIdAndUpdate({ _id: id },{ $push: { approve: newStatus },status:true },{ new: true })
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
        const telephone = req.body.telephone
        const password = bcrypt.hashSync(req.body.password, 10)
        const name = req.body.name
        //เช็คเลขซ้ำ
        const checkofpartner = await Partner.findOne({_id:id})
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
        if(!telephone||!password||!name||!companyname||!level){
            return res.status(400).send({status:false,message:'คุณส่งข้อมูล partner มาไม่ครบ'})
        }
        const partnerdata = {
            telephone: telephone,
            password :password,
            name : name,
            companyname: companyname,
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




module.exports = router;