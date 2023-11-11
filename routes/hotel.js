const express = require('express');
const router = express.Router();

// database Hotel
const Hotel = require('../controllers/hotel.controller')
const Picture = require('../controllers/hotel.picture.controller')
const Amenities = require('../controllers/hotel.amenities.controller')
const Category = require('../controllers/hotel.category.controller')
const Certificate = require('../controllers/hotel.certificate.controller')
const Highlight = require('../controllers/hotel.highlight.controller')

const Partner = require('../models/partner.schema')

//auth
const jwt = require('jsonwebtoken')

//auth
const adminAuth = require('../authentication/adminAuth')
const partnerAuth = require('../authentication/partnerAuth')
const memberAuth =require('../authentication/memberauth')



//ประเภทโรงแรม
//เรียกใช้ข้อมูล category โรงแรมทั้งหมด
router.get('/category',memberAuth.all,Category.GetAll)
//เรียกเพิ่มข้อมูลประเภทโรงแรม
router.post('/category',adminAuth,Category.Create)
//แก้ไขข้อมูลประเภทโรงแรม
router.patch('/category/:id',adminAuth,Category.Update)
//ลบข้อมูลประเภทโรงแรม
router.delete('/category/:id',adminAuth,Category.Delete)


// //ข้อมูลสิ่งอำนวยความสะดวก
router.get('/amenities/',memberAuth.all,Amenities.GetAll)
router.post('/amenities',adminAuth,Amenities.Create)
router.patch('/amenities/:id',adminAuth,Amenities.Update)
router.delete('/amenities/:id',adminAuth,Amenities.Delete)

// //Highlight (สิ่งที่น่าสนใจใกล้ที่พัก)
router.get('/highlight',memberAuth.all,Highlight.GetAll)
router.post('/highlight',adminAuth,Highlight.Create)
router.patch('/highlight/:id',adminAuth,Highlight.Update)
router.delete('/highlight/:id',adminAuth,Highlight.Delete)

//certificate ข้อมูลการรับรองของโรงแรม
router.get('/certificate',memberAuth.all,Certificate.GetAll)
router.post('/certificate',adminAuth,Certificate.Create)
router.patch('/certificate/:id',adminAuth,Certificate.Update)
router.delete('/certificate/:id',adminAuth,Certificate.Delete)

//จัดการข้อมูลโรงแรม
router.get('/',memberAuth.all,Hotel.GetAll)
router.get('/:id',memberAuth.all,Hotel.GetById)
router.post('/',partnerAuth.onlypartner,Hotel.Create)
router.patch('/:id',partnerAuth.onlypartner,Hotel.Update)
router.delete('/:id',partnerAuth.onlypartner,Hotel.Delete)

// //picture management เพิ่ม - ลบ รูปโรงแรม
router.post('/:id/picture',partnerAuth.verifyTokenpartner,Picture.Create)
router.delete('/:id/picture/:pictureid',partnerAuth.verifyTokenpartner,Picture.Delete)





module.exports = router