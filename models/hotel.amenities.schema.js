const mongoose = require('mongoose');

// Define the schema for the HotelUser entity
const hotelAmenitiesSchema = new mongoose.Schema({
    name: { type:String},
    description : { type: String}
});


const HotelAmenities = mongoose.model('HotelAmenities', hotelAmenitiesSchema);

module.exports = HotelAmenities;