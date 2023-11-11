const mongoose = require('mongoose');

// Define the schema for the HotelUser entity
const hotelCategorySchema = new mongoose.Schema({
    name: {type:String},
    description : {type: String}
});


const HotelCategory = mongoose.model('HotelCategory', hotelCategorySchema);

module.exports = HotelCategory;