const mongoose = require('mongoose');

// Define the schema for the HotelUser entity
const roomEntertainmentSchema = new mongoose.Schema({
    name: { type:String},
    description: { type:String},
    service_time: { type: String}
});


const RoomEntertainment = mongoose.model('RoomEntertainment', roomEntertainmentSchema);

module.exports = RoomEntertainment;