const mongoose = require('mongoose');

// Define the schema for the HotelUser entity
const roomTypeSchema = new mongoose.Schema({
    name: {type:String},
    description : {type: String}
});


const RoomType = mongoose.model('RoomType', roomTypeSchema);

module.exports = RoomType;