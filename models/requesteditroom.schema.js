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
  typehotelbed: {type:String},//(เฉพาะโรงแรม) (ประเภทเตียง) 
  typehotelroom:{type:String},//(เฉพาะโรงแรม)(ห้องระดับ)
  image:{ type: [String]},
  latitude: { type: Number},
  longitude: { type: Number},
  Detailsedit:{type:String},
  status:{type:Boolean,default: false},
  room_id :{type: mongoose.Schema.Types.ObjectId,ref:'Room',required:true}, //เพิ่ม
  partnertype:{type:String,required:true}, //(เจ้าของปล่อยเช่าและผู้เช่าปล่อยผู้เช่า)
  timebookingstart:{type:Date},//(เฉพาะผู้ปล่อยเช่า)(เวลาเริ่มต้น)
  timebookingend:{type:Date},//(เฉพาะผู้ปล่อยเช่า) (เวลาสิ้นสุด)
  nearlocation:{type:String},//(ติดกับอะไร)
  distancenearlocation:{type:Number},//(ระยะทางติดกับอะไร)
})
 
const Requesteditroom = mongoose.model('requesteditroom', requesteditroom)

module.exports = Requesteditroom

