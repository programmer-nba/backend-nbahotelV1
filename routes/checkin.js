const express = require('express')
const router = express.Router()
const partnerAuth = require('../authentication/partnerAuth')
const memberAuth = require("../authentication/memberauth")
const Checkin_out = require("../models/checkin_out.schema")
const Booking = require("../models/booking.schema")


// เช็คอิน
router.put('/checkin/:id',memberAuth.verifyTokenmember, async (req,res)=>{
    try{
        const booking_id = req.params.id
        const bookingdata = await Booking.findOne({_id:booking_id})
        if(!bookingdata){
            return res.status(404).send({message:'หาข้อมูล booking ไม่เจอ'})
        }
        //แต่ถ้ามี ให้ทับอันเก้า
        const check_indata = await Checkin_out.findOne({booking_id:booking_id})
        let add = ""
        if(check_indata)
        {
            add = await Checkin_out.findByIdAndUpdate({_id:check_indata._id},{check_in_date:new Date()},{new:true})
            
        }else{
            //ถ้ามี booking_id  ยังไม่มี checkin 
            const checkin = new Checkin_out({
            booking_id:booking_id,
            check_in_date: new Date(),
            check_out_date:''
        })
            add = await checkin.save()
        }

        if(add){
            return res.status(200).send({status:true,message:'คุณได้เช็คอินแล้ว',check_in_out:add})
        }        
    } catch (error) {
        return res.status(500).send({message: error.message})
    }
})

//เช็คเอาท์
router.put('/checkout/:id',memberAuth.verifyTokenmember, async (req,res)=>{
    try{
        const booking_id = req.params.id
        const bookingdata = await Booking.findOne({_id:booking_id})
        if(!bookingdata){
            return res.status(404).send({message:'หาข้อมูล booking ไม่เจอ'})
        }
        const update = await Checkin_out.findOneAndUpdate({booking_id:booking_id},{check_out_date: new Date()},{new:true})
        if(update){
            return res.status(200).send({status:true,message:'คุณได้เช็คเอาท์แล้ว',check_in_out:update})
        }        
    } catch (error) {
        return res.status(500).send({message: error.message})
    }
})

//เรียกข้อมูลทั้่งหมด
router.get('/',memberAuth.memberandpartner, async(req,res)=>{
    try {
        const booking = await Checkin_out.find().populate('booking_id')
        return res.status(200).send(booking);
      } catch (error) {
        return res.status(500).send({message: error.message});
      }
})

//เรียกตามไอดี
router.get('/:id',memberAuth.memberandpartner, async(req,res)=>{
    try {
        const booking = await Checkin_out.findOne({_id:req.params.id}).populate('booking_id')
        if(!booking){
            return res.status(404).send({message:'หาข้อมูลการเช็คอินไม่เจอ'})
        }
        return res.status(200).send(booking);
      } catch (error) {
        return res.status(500).send({message: error.message});
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
        return res.status(500).send({message: error.message});
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