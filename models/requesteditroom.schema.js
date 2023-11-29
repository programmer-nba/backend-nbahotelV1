const mongoose = require('mongoose')

// Define the schema for the Room entity
const requesteditroom = new mongoose.Schema({
  name:{type:String,required: true},
  description: {type:String,required:true},
  phone_number:{type:String,required:true},
  price: {type:Number,required:true},
  guests:{type:Number},
  bedroom:{type:Number},
  bed:{type:Number},
  bathroom:{type:Number},
  address: { type: String, required: true },
  tambon: { type: String, required: true },
  amphure: { type: String, required: true },
  province : { type: String, required: true },
  partner_id:{type: mongoose.Schema.Types.ObjectId,ref:'Partner',required:true},
  type:{type: mongoose.Schema.Types.ObjectId,ref:'RoomType',required:true},
  image:{ type: [String]},
  latitude: { type: Number},
  longitude: { type: Number},
  Detailsedit:{type:String},
  status:{type:Boolean,default: false},
  room_id :{type: mongoose.Schema.Types.ObjectId,ref:'Room',required:true}
})

const Requesteditroom = mongoose.model('requesteditroom', requesteditroom)

module.exports = Requesteditroom

