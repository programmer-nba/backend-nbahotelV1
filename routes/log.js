var express = require('express');
var router = express.Router();
const adminAuth = require('../authentication/adminAuth');
const Log = require('../controllers/log.controller')
//admin
router.get('/admin/',adminAuth,Log.Getlogadmin)
router.delete('/admin/:id',adminAuth,Log.Deletelogadmin)

//partner
router.get('/partner/',adminAuth,Log.Getlogpartner)
router.delete('/partner/:id',adminAuth,Log.Deletelogpartner)

//member
router.get('/member/',adminAuth,Log.Getlogmember)
router.delete('/member/',adminAuth,Log.Deletelogmember)

module.exports = router;