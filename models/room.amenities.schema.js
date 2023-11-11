const mongoose = require('mongoose');

// Define the schema for the HotelUser entity
const roomAmenitiesSchema = new mongoose.Schema({
    name : { type:String},
    description : {type:String}
});


const RoomAmenities = mongoose.model('RoomAmenities', roomAmenitiesSchema);

module.exports = RoomAmenities;