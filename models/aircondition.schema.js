const mongoose = require('mongoose');

// Define the schema for the HotelUser entity
const airconditionSchema = new mongoose.Schema({
    name: { type:String,required: true},
    description : { type:String}
});


const Aircondition = mongoose.model('Aircondition', airconditionSchema);

module.exports = Aircondition;