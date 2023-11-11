const mongoose = require('mongoose');

// Define the schema for the HotelUser entity
const roomStatusTypeSchema = new mongoose.Schema({
    name : { type:String},
    description : { type:String}
});


const RoomStatusType = mongoose.model('RoomStatusType', roomStatusTypeSchema);

module.exports = RoomStatusType;