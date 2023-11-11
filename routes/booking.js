var express = require('express');
var router = express.Router();
const Booking = require('../controllers/booking.controller')
var adminAuth = require('../authentication/adminAuth');
var partnerAuth = require('../authentication/partnerAuth')
const memberAuth = require('../authentication/memberauth')


//สร้าง 
router.post('/',memberAuth.verifyTokenmember,Booking.addbooking)
//เรียกข้อมูลการจอง
router.get('/',memberAuth.all,Booking.GetAll)
//เรียกข้อมูลการจอง ตาม id
router.get('/:id',memberAuth.all,Booking.GetByid)
//เรียกข้อมูลการจองตาม hotel_id
router.get('/hotel/:id',memberAuth.all,Booking.GetByhotel)
//เรียกข้อมูลการจองตาม room_id
router.get('/room/:id',memberAuth.all,Booking.GetByroom)
//เรียกข้อมูลการจอง ตาม member id
router.get('/member/:id',memberAuth.all,Booking.GetBymember)

//อนุมัติการจองห้อง
router.put('/AcceptBooking/:id',partnerAuth.onlypartner,Booking.AcceptBooking)
//ไม่อนุมัติการจองห้อง
router.put('/UnacceptBooking/:id',partnerAuth.onlypartner,Booking.unacceptbooking)
//จ่ายเงิน
router.put('/paymentBooking/:id',memberAuth.verifyTokenmember,Booking.Payment)
//ยืนยันการจ่ายเงิน
router.put('/confirmBookingPayment/:id',partnerAuth.onlypartner,Booking.confirmbookingpayment)
//ไม่ยืนยันการจ่ายเงิน
router.put('/Unconfirmbookingpayment/:id',partnerAuth.onlypartner,Booking.unconfirmbookingpayment)


module.exports = router;