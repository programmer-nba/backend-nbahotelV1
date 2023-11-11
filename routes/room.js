const express = require('express');
const router = express.Router();
const adminAuth = require('../authentication/adminAuth')
const partnerAuth = require('../authentication/partnerAuth')
// controllers
const Room = require('../controllers/room.controller')
const picture = require('../controllers/room.picture.controller')
const RoomEntertainment = require('../controllers/room.entertainment.controller')
const FurnitureType = require('../controllers/room.furnituretype.controller')
const RoomSecurity = require('../controllers/room.security.controller')
const RoomService = require('../controllers/room.service.controller')
const RoomStatus = require('../controllers/room.status.controller')
const RoomType = require('../controllers/room.type.controller')
const RoomView = require('../controllers/room.view.controller')
const AirType = require('../controllers/aircondition.controller')
const RoomAmenities = require('../controllers/room.amenities.controller')
const BathType = require('../controllers/room.bathtype.controller')
const BedType = require('../controllers/room.bedtype.controller');


// // room standard infomation
//air condition แอร์
router.get('/aircondition',AirType.GetAll)
router.post('/aircondition',adminAuth,AirType.Create)
router.patch('/aircondition/:id',adminAuth,AirType.Update)
router.delete('/aircondition/:id',adminAuth,AirType.Delete)


//ข้อมูลประเภทห้อง
router.get('/bedtype',BedType.GetAll)
router.post('/bedtype',adminAuth,BedType.Create)
router.patch('/bedtype/:id',adminAuth,BedType.Update)
router.delete('/bedtype/:id',adminAuth,BedType.Delete)

//bath ข้อมูลประเภทห้องอาบน้ำ
router.get('/bathtype',BathType.GetAll)
router.post('/bathtype',adminAuth,BathType.Create)
router.patch('/bathtype/:id',adminAuth,BathType.Update)
router.delete('/bathtype/:id',adminAuth,BathType.Delete)

//furniture ข้อมูลประเภทเฟอร์นิเจอร์
router.get('/furnituretype',FurnitureType.GetAll)
router.post('/furnituretype',adminAuth,FurnitureType.Create)
router.patch('/furnituretype/:id',adminAuth,FurnitureType.Update)
router.delete('/furnituretype/:id',adminAuth,FurnitureType.Delete)


//amenities ข้อมูลสิ่งอำนายความสะดวกในห้อง
router.get('/amenities',RoomAmenities.GetAll)
router.post('/amenities',adminAuth,RoomAmenities.Create)
router.patch('/amenities/:id',adminAuth,RoomAmenities.Update)
router.delete('/amenities/:id',adminAuth,RoomAmenities.Delete)


//entertainments ข้อมูลสิ่งให้ความบันเทิง
router.get('/entertainment',RoomEntertainment.GetAll)
router.post('/entertainment',adminAuth,RoomEntertainment.Create)
router.patch('/entertainment/:id',adminAuth,RoomEntertainment.Update)
router.delete('/entertainment/:id',adminAuth,RoomEntertainment.Delete)

//room services บริการรูมเซอร์วิส
router.get('/service',RoomService.GetAll)
router.post('/service',adminAuth,RoomService.Create)
router.patch('/service/:id',adminAuth,RoomService.Update)
router.delete('/service/:id',adminAuth,RoomService.Delete)


//room status  ข้อมูลสถานะห้อง
router.get('/status',RoomStatus.GetAll)
router.post('/status',adminAuth,RoomStatus.Create)
router.patch('/status/:id',adminAuth,RoomStatus.Update)
router.delete('/status/:id',adminAuth,RoomStatus.Delete)

//room view ข้อมูลวิวของห้่อง
router.get('/view',RoomView.GetAll)
router.post('/view',adminAuth,RoomView.Create)
router.patch('/view/:id',adminAuth,RoomView.Update)
router.delete('/view/:id',adminAuth,RoomView.Delete)

//room type ข้อมูลประเภทห้อง
router.get('/type',RoomType.GetAll)
router.post('/type',adminAuth,RoomType.Create)
router.patch('/type/:id',adminAuth,RoomType.Update)
router.delete('/type/:id',adminAuth,RoomType.Delete)

// //room security ข้อมูลความปลอดภัยของห้อง
router.get('/security',RoomSecurity.GetAll)
router.post('/security',adminAuth,RoomSecurity.Create)
router.patch('/security/:id',adminAuth,RoomSecurity.Update)
router.delete('/security/:id',adminAuth,RoomSecurity.Delete)



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

module.exports = router;