const mongoose = require('mongoose');

// Define the schema for the HotelUser entity
const roomTypeSchema = new mongoose.Schema({
    name_th: { type:String,required: true},
    name_en: { type:String},
    description : { type:String}
});


const RoomType = mongoose.model('RoomType', roomTypeSchema);

module.exports = RoomType;