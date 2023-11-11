const mongoose = require('mongoose');

// Define the schema for the HotelUser entity
const securityTypeSchema = new mongoose.Schema({
    name: { type:String,required: true},
    description : { type:String}
});


const SecurityType = mongoose.model('SecurityType', securityTypeSchema);

module.exports = SecurityType;