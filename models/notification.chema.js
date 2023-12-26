const mongoose = require('mongoose');
// Define the schema for the HotelUser entity
const Notification = new mongoose.Schema({
    admin_id:{type:mongoose.Schema.Types.ObjectId,ref:'admin'},  //(รหัสadmin)
    partner_id:{type:mongoose.Schema.Types.ObjectId,ref:'Partner'},//(รหัส partner)
    member_id:{type:mongoose.Schema.Types.ObjectId,ref:'Member'},//(รหัส member)
    title:{type:String}, //(หัวข้อ)
    detail:{type:String}, //(รายละเอียด)
    status: { type: String, enum: ['all', 'partner', 'member',"only"], default: 'all' },

});


const notification = mongoose.model('notification', Notification);

module.exports = notification;
