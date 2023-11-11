const mongoose = require('mongoose');

const prePaymentSchema = new mongoose.Schema({
    booking_id:{type:mongoose.Schema.Types.ObjectId,ref:'Booking',require:true},
    slip_image:{type:String},
    total_amount: { type: Number, required: true },
    payment_status: { type: String, enum: ['รอดำเนินการ', 'โอนเรียบร้อย'],require:true, default: 'รอดำเนินการ' }
  },
  {timestamps:true}
  );
  
  const PrePayment = mongoose.model('PrePayment', prePaymentSchema);

  module.exports = {PrePayment};