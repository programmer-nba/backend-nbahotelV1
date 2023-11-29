var express = require('express');
var router = express.Router();
var adminAuth = require('../authentication/adminAuth');
var partnerAuth = require('../authentication/partnerAuth')
const memberAuth = require('../authentication/memberauth')
const Requesteditroom = require('../models/requesteditroom.schema')
const {Room} = require('../models/room.schema')
const Partner = require("../models/partner.schema");
const jwt = require("jsonwebtoken");

//สร้างคำร้องขอ
router.post('/',partnerAuth.onlypartner,async (req,res)=>{
    try {
        const {name,description,phone_number,price,guests,bedroom,bed,bathroom
            ,tambon,address,amphure,province,partner_id
            ,type,Detailsedit,room_id,latitude,longitude} = req.body
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        const decoded =  jwt.verify(token,secretKey)
        const partner = await Partner.findOne({name:decoded.name})
        const dataeditroom = new Requesteditroom({
                    name:name,
                    description:description,
                    phone_number:phone_number,
                    price:price,
                    type:type,
                    guests:guests,
                    bedroom:bedroom,
                    bed:bed,
                    bathroom:bathroom,
                    latitude:latitude,
                    longitude:longitude,
                    address:address,
                    tambon:tambon,
                    amphure:amphure,
                    province:province, 
                    partner_id:partner._id,
                    Detailsedit:Detailsedit,
                    room_id:room_id 
        }) 
        const add = await dataeditroom.save()
        if(add){
            return res.status(200).send({status:true,message:"เพิ่มคำร้องขอแก้ห้องพัก",data:add})
        }
    } catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
    
})
//ดึงคำร้องขอทั้งหมด
router.get('/',partnerAuth.verifyTokenpartner,async (req,res)=>{
    try {
        const requesteditroom = await Requesteditroom.find();
        if(requesteditroom){
            return res.status(200).send({status:true,data:requesteditroom});
        }
    } catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
})
//ดึงคำร้อง by id
router.get('/byid/:id',partnerAuth.verifyTokenpartner,async (req,res)=>{
    try {
        const id = req.params.id
        const requesteditroom = await Requesteditroom.findOne({_id:id});
        if(requesteditroom){
            return res.status(200).send({status:true,data:requesteditroom});
        }
    } catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
})
//อนุมัติให้แก้ไขห้องพัก
router.put('/accept/:id',adminAuth,async (req,res)=>{
    try {
        const id = req.params.id
        const requesteditroomdata = await Requesteditroom.findOne({_id:id}) 
        const data = {
            name:requesteditroomdata.name,
            description:requesteditroomdata.description,
            phone_number:requesteditroomdata.phone_number,
            price:requesteditroomdata.price,
            type:requesteditroomdata.type,
            guests:requesteditroomdata.guests,
            bedroom:requesteditroomdata.bedroom,
            bed:requesteditroomdata.bed,
            bathroom:requesteditroomdata.bathroom,
            latitude:requesteditroomdata.latitude,
            longitude:requesteditroomdata.longitude,
            address:requesteditroomdata.address,
            tambon:requesteditroomdata.tambon,
            amphure:requesteditroomdata.amphure,
            province:requesteditroomdata.province,           
        }
        const editroom = await Room.findByIdAndUpdate({_id:requesteditroomdata.room_id},data,{new:true})
        const edit = await Requesteditroom.findByIdAndUpdate(id,{status:true},{new:true})
        if(edit && editroom){
            return res.status(200).send({status:true,message:"อนุมัติคำร้องขอแก้ข้อมูลห้องพัก",data:edit})
        }
    } catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
})
//ไม่อนุมัติให้แก้ไขห้องพัก
router.put('/unaccept/:id',adminAuth,async (req,res)=>{
    try {
        const id = req.params.id
        const edit = await Requesteditroom.findByIdAndUpdate(id,{status:false},{new:true})
        if(edit){
            return res.status(200).send({status:true,message:"ไม่อนุมัติคำร้องขอแก้ข้อมูลห้องพัก",data:edit})
        }
    } catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
})
//ลบคำร้องขอแก้ไขห้องพัก
router.delete('/:id',partnerAuth.verifyTokenpartner,async (req,res)=>{
    try {
        const id = req.params.id
        const requesteditroom = await Requesteditroom.findByIdAndDelete(id)
        if(requesteditroom){
            return res.status(200).send({status:true,message:"ลบข้อมูลสำเร็จ",data:requesteditroom});
        }
    } catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
})
module.exports = router;