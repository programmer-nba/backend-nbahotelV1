const mongoose = require('mongoose')

// Define the schema for the Room entity
const roomSchema = new mongoose.Schema({
  hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  type: { type: {name_th: {type: String},name_en: {type: String},description: {type: String}}, required: true },
  quota: {type: Number,default: 0},
  rating: { type: Number },
  total_rate: {type: Number},
  cleaning_rate: { type: Number},
  total_cleaning_rage: {type: Number},
  imageURl: {type: [String]},
  detail: {type: String},
  price: { type: Number, required: true },
  cost:{type: Number, required: true},
  unit: {type: String,required: true}, // unit price (per day or night or hours)
  // highlight
  size: { type: Number},
  bed_type: { type: {name: {type: String},description: {type: String}}, required: true },
  aircondition: { type: {name: {type: String},description: {type: String}}, required: true },
  max_person: { type: Number, required: true},
  children: { type: String, required: true,default:false},
  view_type: { type: {name: {type: String},description: {type: String}},required: true},
  bath_type: { type: {name: {type: String},description: {type: String}}, required: true},
  smoke_type: { type: String, required: true},
  furniture: { type: Array, required: true},
  room_service: { type: Array, required: true},
  amenities: { type: Array, required: true},
  // entertainment
  wifi: { type: String, required: true},
  entertainment: { type: Array },
  // security
  security: {type: {name: {type: String},description: {type: String}}, required: true}, // default is false
  // promotion
  promotions: { type: Array},
  // status
  status: { type: {name: {type: String},description: {type: String}},required: true},
  checkin_status: {type: String},
  approved:{type:Boolean,default:false},
})

const Room = mongoose.model('Room', roomSchema)

module.exports = {Room,roomSchema}
