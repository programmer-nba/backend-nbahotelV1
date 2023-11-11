const mongoose = require('mongoose');

// Define the schema for the HotelUser entity
const bathTypeSchema = new mongoose.Schema({
    name: { type:String,required: true},
    description: { type: String}
});


const BathType = mongoose.model('BathType', bathTypeSchema);

module.exports = BathType;