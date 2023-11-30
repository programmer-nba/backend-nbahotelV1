const express = require('express')
const router = express.Router()
const partnerAuth = require('../authentication/partnerAuth')
const memberAuth = require("../authentication/memberauth")
const Checkin_out = require("../models/checkin_out.schema")
const Booking = require("../models/booking.schema")
const jwt = require("jsonwebtoken");
const Partner = require('../models/partner.schema')
const {Room} = require('../models/room.schema')
const Member = require('../models/member.schema')

router.get('/member/',memberAuth.memberandpartner, async(req,res)=>{
    try {
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        const decoded =  jwt.verify(token,secretKey)
        const member = await Member.findOne({_id:decoded._id})
        //หาจอง
        const booking = await Booking.find({ member_id: member._id })
        //หาbooking_id
        const booking_id= booking.map(booking=>booking._id)
        const check_in = await Checkin_out.find({booking_id:booking_id}).populate(
        {
            path:"booking_id",
            populate: [
                { path:"member_id"},
                { 
                    path: "room_id",
                    populate: [
                        { path: "partner_id" },
                        { path: "type" } 
                      ],
                } 
              ]
        })
        if(!check_in){
            return res.status(404).send({status:false,message:'หาข้อมูลbookingไม่เจอ'})
        }
        return res.status(200).send({status:true,data:check_in});
      } catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }
})
// เช็คอิน
router.put('/checkin/:id',memberAuth.verifyTokenmember, async (req,res)=>{
    try{
        const checkin_id = req.params.id
        
        const edit = await Checkin_out.findByIdAndUpdate({_id:checkin_id},{check_in_date:new Date()},{new:true})
        if(edit){
            return res.status(200).send({status:true,message:'คุณได้เช็คอินแล้ว',check_in_out:edit})
        }        
    } catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
})

//เช็คเอาท์
router.put('/checkout/:id',memberAuth.verifyTokenmember, async (req,res)=>{
    try{
        const checkout_id = req.params.id
       
        const update = await Checkin_out.findOneAndUpdate({_id:checkout_id},{check_out_date: new Date()},{new:true})
        if(update){
            return res.status(200).send({status:true,message:'คุณได้เช็คเอาท์แล้ว',check_in_out:update})
        }        
    } catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
})

//เรียกข้อมูลทั้่งหมด
router.get('/',memberAuth.memberandpartner, async(req,res)=>{
    try {
        const booking = await Checkin_out.find().populate('booking_id')
        return res.status(200).send(booking);
      } catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }
})
//เรียกข้อมูลตาม partner


//เรียกตามไอดี
router.get('/:id',memberAuth.memberandpartner, async(req,res)=>{
    try {
        const booking = await Checkin_out.findOne({_id:req.params.id}).populate('booking_id')
        if(!booking){
            return res.status(404).send({message:'หาข้อมูลการเช็คอินไม่เจอ'})
        }
        return res.status(200).send(booking);
      } catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }
})

//เรียกตาม booking_id
router.get('/booking/:id',memberAuth.memberandpartner, async(req,res)=>{
    try {
        const booking = await Checkin_out.findOne({booking_id_id:req.params.id}).populate('booking_id')
        if(!booking){
            return res.status(404).send({message:'หาข้อมูลbookingไม่เจอ'})
        }
        return res.status(200).send(booking);
      } catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }
})

// อันเก่า
// //checked in out
// router.post('/verifycheckinuser',partnerAuth.verifyTokenpartner,Checkin.VerifyCheckedInUser);
// router.post('/confirm-otp',partnerAuth.verifyTokenpartner,Checkin.ConfirmCheckin)
// router.post('/checkout/:id',partnerAuth.verifyTokenpartner,Checkin.CheckOut);

// //fake api
// router.post('/fackAccept',Checkin.FakeAccept);
// router.post('/fakecheckin',Checkin.FakeCheckin);
// router.post('/fakecheckout',Checkin.FakeCheckout);

module.exports = router;