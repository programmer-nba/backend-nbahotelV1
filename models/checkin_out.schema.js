const mongoose = require('mongoose');

const checkin_outSchema = new mongoose.Schema({
    booking_id:{type:mongoose.Schema.Types.ObjectId,ref:'Booking',require:true},
    check_in_date: { type: Date },
    check_out_date:{ type: Date }
},{timestamps:true})
  
const Checkin_out = mongoose.model('Checkin_out', checkin_outSchema);

module.exports = Checkin_out
