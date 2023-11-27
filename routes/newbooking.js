var express = require('express');
var router = express.Router();
const Booking = require('../controllers/newbooking.controller')
var adminAuth = require('../authentication/adminAuth');
var partnerAuth = require('../authentication/partnerAuth')
const memberAuth = require('../authentication/memberauth')


//สร้าง 
router.post('/',memberAuth.verifyTokenmember,Booking.addbooking)
//เรียกข้อมูลการจอง
router.get('/',memberAuth.all,Booking.GetAll)
//เรีัยกข้อมูลตาม partner 
router.get('/partner/',memberAuth.all,Booking.GetBypartner)
//เรีัยกข้อมูลตาม partner 
router.get('/partner/payment/',memberAuth.all,Booking.GetBypartnerandpayment)
//เรียกข้อมูลการจอง ตาม member id
router.get('/member/',memberAuth.all,Booking.GetBymember)
//เรียกข้อมูลการจอง ตาม id
router.get('/:id',memberAuth.all,Booking.GetByid)

//เรียกข้อมูลการจองตาม room_id
router.get('/room/:id',memberAuth.all,Booking.GetByroom)

//จ่ายเงิน
router.put('/paymentBooking/:id',memberAuth.verifyTokenmember,Booking.Payment)
//ยืนยันการจ่ายเงิน
router.put('/confirmBookingPayment/:id',partnerAuth.onlypartner,Booking.confirmbookingpayment)
//ไม่ยืนยันการจ่ายเงิน
router.put('/Unconfirmbookingpayment/:id',partnerAuth.onlypartner,Booking.unconfirmbookingpayment)


module.exports = router;