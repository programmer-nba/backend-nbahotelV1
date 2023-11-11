const mongoose = require('mongoose');

// Define the schema for the HotelUser entity
const hotelCertificate = new mongoose.Schema({
    name: { type:String},
    description: { type:String}
});


const HotelCertificate = mongoose.model('HotelCertificate', hotelCertificate);

module.exports = HotelCertificate;