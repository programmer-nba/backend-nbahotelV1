const mongoose = require('mongoose');

// Define the schema for the HotelUser entity
const bedTypeSchema = new mongoose.Schema({
    name: { type:String,required: true},
    description : { type:String}
});


const BedType = mongoose.model('BedType', bedTypeSchema);

module.exports = BedType;