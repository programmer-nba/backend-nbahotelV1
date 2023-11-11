const mongoose = require('mongoose');

// Define the schema for the HotelUser entity
const viewTypeSchema = new mongoose.Schema({
    name: { type:String,required: true},
    description: { type:String}
});


const ViewType = mongoose.model('ViewType', viewTypeSchema);

module.exports = ViewType;