const mongoose = require('mongoose');

const roomServiceSchema = new mongoose.Schema({
    name: { type:String},
    description: {type: String},
    service_time: {type: String}
});


const RoomService = mongoose.model('RoomService', roomServiceSchema);

module.exports = RoomService;