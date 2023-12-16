var express = require('express');
var router = express.Router();
var adminAuth = require('../authentication/adminAuth');
var partnerAuth = require('../authentication/partnerAuth')
const memberAuth = require('../authentication/memberauth')
const jwt = require("jsonwebtoken");
const Review = require("../controllers/review.controller")

//ค้นหารีวิวทั้งหมด
router.get('/',memberAuth.all,Review.getall)

//ค้นหารีวิว by id
router.get('/byid/:id',memberAuth.all,Review.getbyid)
//ค้นหารีวิว by room_id
router.get('/byroom/:id',Review.getbyroom)
//ค้นหารีวิวตาม token
router.get('/token/',memberAuth.all,Review.getbytoken)

//เพิ่มรีวิว
router.post('/',memberAuth.verifyTokenmember,Review.add)

//แก้รีวิว 
router.put('/:id',memberAuth.verifyTokenmember,Review.edit)

//ลบรีวิว
router.delete('/:id',memberAuth.all,Review.delete)

module.exports = router;