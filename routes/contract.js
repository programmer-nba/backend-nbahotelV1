var express = require('express');
var router = express.Router();

const jwt = require("jsonwebtoken");
const partnerAuth = require('../authentication/partnerAuth')
//schema
const Contract = require('../models/contract.schema')
const Partner = require("../models/partner.schema")
//เรียกดูข้อมูลสัญญาทั้งหมด
router.get('/',partnerAuth.verifyTokenpartner, async (req,res)=>{
    try{    
        const contract = await Contract.find().populate("partner_id")
        if(!contract){
            return res.status(404).send({status:false,message:"ไม่มีข้อมูล contract"})
        }
        return res.status(200).send({status:true,data:contract})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
})
//เรียกข้อมูล by partner 
router.get('/partner/',partnerAuth.verifyTokenpartner,async (req,res)=>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        const decoded =  jwt.verify(token,secretKey)
        const partner = await Partner.findOne({_id:decoded._id})
        const contract = await Contract.findOne({partner_id:partner._id}).populate("partner_id")
        if(!contract){
            return res.status(200).send({status:false,message:"ไม่มีข้อมูล contract"})
        }
        return res.status(200).send({status:true,data:contract})
    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }


})
//เรียก BY id
router.get('/contract_id/:id',partnerAuth.verifyTokenpartner, async (req,res)=>{
    try{    
        const id = req.params.id
        const contract = await Contract.findOne({_id:id}).populate("partner_id")
        if(!contract){
            return res.status(404).send({status:false,message:"ไม่มีข้อมูล contract"})
        }
        return res.status(200).send({status:true,data:contract})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
})
//เพิ่มข้อมูลสัญญา
router.post('/',partnerAuth.onlypartner,async (req,res)=>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        const decoded =  jwt.verify(token,secretKey)
        const partner = await Partner.findOne({_id:decoded._id})
        const Contractdata = new Contract({
            partner_id: partner._id,
            status: false,
            time: null,
            signature: "",
            message:"",
          });
        const add = await Contractdata.save()
        if(add)
        {
            return res.status(200).send({status:true,data:add})    
        }
        
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
})

//ยืนยันสัญญา
router.put('/accept/:id',partnerAuth.onlypartner,async (req,res)=>{
    const id = req.params.id
    const contractdata = await Contract.findOne({_id:id}).populate("partner_id")
    const dataupdate = {
        status: true,
        time: new Date(),
        signature: contractdata.partner_id.name,
        message:`คุณ ${contractdata.partner_id.name} ได้ยินยอมในสัญญาเรียบร้อยแล้ว`,
    }
    const update = await Contract.findByIdAndUpdate(id,dataupdate,{new:true}) 
    if(update)
    {
        return res.status(200).send({status:true,message:`คุณ ${contractdata.partner_id.name} ได้ยินยอมในสัญญาเรียบร้อยแล้ว`,update:update})
    }
})

//ลบข้อมูลสัญญา่
router.delete('/:id',partnerAuth.verifyTokenpartner, async (req,res)=>{
    try{
        const id = req.params.id
        const checkcontract = await Contract.findOne({_id:id})
        if(!checkcontract)
        {
            return res.status(404).send({status:false,message:"หาข้อมูลไม่เจอ Contract"})
        }
        const deleteContract = await Contract.deleteOne({_id:id})
        if(deleteContract){
            return res.status(200).send({status:true,message:"ลบข้อมูล Contract สำเร็จ"})
        }
    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
})


module.exports = router;