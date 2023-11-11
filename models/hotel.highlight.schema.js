const mongoose = require('mongoose');

// Define the schema for the HotelUser entity
const hotelHighlight = new mongoose.Schema({
    name: { type:String},
    description: { type:String}
});


const HotelHighlight = mongoose.model('HotelHighlight', hotelHighlight);

module.exports = HotelHighlight;