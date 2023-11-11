const mongoose = require('mongoose');

// Define the schema for the HotelUser entity
const roomFurnitureSchema = new mongoose.Schema({
    name: { type:String,required: true},
    description : { type: String}
});


const RoomFurniture = mongoose.model('RoomFurniture', roomFurnitureSchema);

module.exports = RoomFurniture;