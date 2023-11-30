var express = require('express');
var router = express.Router();

var adminAuth = require('../authentication/adminAuth');
var partnerAuth = require('../authentication/partnerAuth')
const memberAuth = require('../authentication/memberauth')
//crotroller
const notification = require('../controllers/notification.controller')
//แจ้งเตือนทั้งหมด
router.post('/admin/',adminAuth,notification.addall)
//แจ้ง partner
router.post ('/partner/',partnerAuth.verifyTokenpartner,notification.addpartner)
//แจ้ง member
router.post ('/member/',memberAuth.verifyTokenmember,notification.addmember)

//ดึงข้อมูลทั้งหมด
router.get('/',memberAuth.all,notification.getall)
//ดึงข้อมูล by id
router.get('/byid/:id',memberAuth.all,notification.getbyid)
//ดึงข้อมูล by token 
router.get('/token/',memberAuth.all,notification.getbyroles)

//แก้ไข
router.put('/:id',memberAuth.all,notification.edit)

//ลบ
router.delete('/:id',memberAuth.all,notification.delete)

module.exports = router;