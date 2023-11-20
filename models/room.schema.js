const mongoose = require('mongoose')

// Define the schema for the Room entity
const roomSchema = new mongoose.Schema({
  name:{type:String,required: true},
  description: {type:String,required:true},
  phone_number:{type:String,required:true},
  price: {type:Number,required:true},
  guests:{type:Number},
  bedroom:{type:Number},
  bed:{type:Number},
  bathroom:{type:Number},
  latitude: { type: Number},
  longitude: { type: Number},
  address: { type: String, required: true },
  tambon: { type: String, required: true },
  amphure: { type: String, required: true },
  province : { type: String, required: true },
  status:{type:Boolean,default:false},
  approve : {
    type: [
      {
        statusapprove: { type: String, default: 'รออนุมัติ' },
        timestamps: { type: Date, default: Date.now }
      }
    ],
    default: [{ statusapprove: 'รออนุมัติ', timestamps: new Date()}]
  },
  statusbooking :{type:Boolean,default:false},
  partner_id:{type: mongoose.Schema.Types.ObjectId,ref:'Partner',required:true},
  type:{type: mongoose.Schema.Types.ObjectId,ref:'RoomType',required:true},
})

const Room = mongoose.model('Room', roomSchema)

module.exports = {Room,roomSchema}
