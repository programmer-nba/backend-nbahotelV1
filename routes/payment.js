var express = require('express');
var router = express.Router();
const Payment = require('../controllers/prepayment.controller');
var adminAuth = require('../authentication/adminAuth');
var partnerAuth = require('../authentication/partnerAuth')

router.get('/',Payment.GetAll)
router.get('/:id',Payment.GetByid)
router.get('/booking/:id',Payment.GetBooking)

// router.get('/:id/:payment_number',Payment.GetHotelPaymentSlipByPaymentNumber);
// router.post('/',Payment.CreatePrepayment);
// router.post('/uploadslip/:id',Payment.UploadSlip);

module.exports = router;