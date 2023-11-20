const express = require('express');
const router = express.Router();
const adminAuth = require('../authentication/adminAuth')
const partnerAuth = require('../authentication/partnerAuth')
// controllers
const Room = require('../controllers/room.controller')
const picture = require('../controllers/room.picture.controller')
const RoomType = require('../controllers/room.type.controller')

// // room standard infomation


//room type ข้อมูลประเภทห้อง
router.get('/type',RoomType.GetAll)
router.post('/type',adminAuth,RoomType.Create)
router.patch('/type/:id',adminAuth,RoomType.Update)
router.delete('/type/:id',adminAuth,RoomType.Delete)


// main room routes
router.get('/',Room.GetAll)
router.get('/:id',Room.GetById)
router.get('/hotel/:id',Room.GetHotelRoom)
router.post('/hotel/',partnerAuth.onlypartner,Room.Create)
router.patch('/:id',partnerAuth.onlypartner,Room.Update)

router.delete('/:id',partnerAuth.onlypartner,Room.Delete)

//picture management routes  
router.post('/picture/:id',partnerAuth.onlypartner,picture.Create)
router.delete('/picture/:id/:pictureid',partnerAuth.onlypartner,picture.Delete)

// admin อนุมัติห้อง
router.put('/approve/:id')
router.put('/unapprove/:id')

// partner เปิด-ปิด ห้องทั้งหมด
router.put('/openstatus/')
router.put('/closestatus/')
module.exports = router;