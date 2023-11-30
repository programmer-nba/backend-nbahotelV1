var express = require('express');
var router = express.Router();

const jwt = require("jsonwebtoken");
const memberAuth = require('../authentication/memberauth')
//schema
const ContractMember = require('../models/contractmember.schema')
const Member = require("../models/member.schema")
//เรียกดูข้อมูลสัญญาทั้งหมด
router.get('/',memberAuth.all, async (req,res)=>{
    try{    
        const contractmember = await ContractMember.find().populate("member_id")
        if(!contractmember){
            return res.status(404).send({status:false,message:"ไม่มีข้อมูล ContractMember"})
        }
        return res.status(200).send({status:true,data:contractmember})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
})
//เรียกข้อมูล by member
router.get('/member/',memberAuth.verifyTokenmember,async (req,res)=>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        const decoded =  jwt.verify(token,secretKey)
        const member = await Member.findOne({_id:decoded._id})
        const contractmember = await ContractMember.findOne({member_id:member._id}).populate("member_id")
        if(!contractmember){
            return res.status(200).send({status:false,message:"ไม่มีข้อมูล ContractMember"})
        }
        return res.status(200).send({status:true,data:contractmember})
    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }


})
//เรียก BY id
router.get('/contractmember_id/:id',memberAuth.all, async (req,res)=>{
    try{    
        const id = req.params.id
        const contractmember = await ContractMember.findOne({_id:id}).populate("member_id")
        if(!contractmember){
            return res.status(404).send({status:false,message:"ไม่มีข้อมูล ContractMember"})
        }
        return res.status(200).send({status:true,data:contractmember})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
})
//เพิ่มข้อมูลสัญญา
router.post('/',memberAuth.verifyTokenmember,async (req,res)=>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        const decoded =  jwt.verify(token,secretKey)
        const member = await Member.findOne({_id:decoded._id})
        const ContractMemberdata = new ContractMember({
            member_id: member._id,
            status: false,
            time: null,
            signature: "",
            message:"",
          });
        const add = await ContractMemberdata.save()
        if(add)
        {
            return res.status(200).send({status:true,data:add})    
        }
        
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
})

//ยืนยันสัญญา
router.put('/accept/:id',memberAuth.verifyTokenmember,async (req,res)=>{
    const id = req.params.id
    const ContractMemberdata = await ContractMember.findOne({_id:id}).populate("member_id")
    const dataupdate = {
        status: true,
        time: new Date(),
        signature: ContractMemberdata.member_id.name,
        message:`คุณ ${ContractMemberdata.member_id.name} ได้ยินยอมในสัญญาเรียบร้อยแล้ว`,
    }
    const update = await ContractMember.findByIdAndUpdate(id,dataupdate,{new:true}) 
    if(update)
    {
        return res.status(200).send({status:true,message:`คุณ ${ContractMemberdata.member_id.name} ได้ยินยอมในสัญญาเรียบร้อยแล้ว`,update:update})
    }
})

//ลบข้อมูลสัญญา่
router.delete('/:id',memberAuth.verifyTokenmember, async (req,res)=>{
    try{
        const id = req.params.id
        const checkContractMember = await ContractMember.findOne({_id:id})
        if(!checkContractMember)
        {
            return res.status(404).send({status:false,message:"หาข้อมูลไม่เจอ ContractMember"})
        }
        const deleteContractMember = await ContractMember.deleteOne({_id:id})
        if(deleteContractMember){
            return res.status(200).send({status:true,message:"ลบข้อมูล ContractMember สำเร็จ"})
        }
    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
})


module.exports = router;