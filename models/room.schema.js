const mongoose = require('mongoose')

// Define the schema for the Room entity
const roomSchema = new mongoose.Schema({
  name:{type:String,required: true}, // ชื่อห้องพัก
  description: {type:String,required:true}, // รายละเอียด
  phone_number:{type:String,required:true}, //เบอร์โทรศัพท์
  price: {type:Number,required:true}, //ราคาห้องพัก
  guests:{type:Number}, //จำนวนคนที่เข้าพักได้
  bedroom:{type:Number}, //ห้อง
  bed:{type:Number}, // เตียงนอน
  bathroom:{type:Number}, //ห้องน้ำ
  latitude: { type: Number}, // google map
  longitude: { type: Number}, 
  address: { type: String, required: true }, //ที่อยู่
  tambon: { type: String, required: true }, // ตำบล
  amphure: { type: String, required: true }, //อำเภอ
  province : { type: String, required: true }, //จังหวัด
  status:{type:Boolean,default:false}, //สถานะอนุมัติห้อง
  approve : {
    type: [
      {
        statusapprove: { type: String, default: 'รออนุมัติ' },
        timestamps: { type: Date, default: Date.now }
      }
    ],
    default: [{ statusapprove: 'รออนุมัติ', timestamps: new Date()}]
  }, //อนุมัติห้อง
  statusbooking :{type:Boolean,default:false}, //เปิด-ปิดจอง
  partner_id:{type: mongoose.Schema.Types.ObjectId,ref:'Partner',required:true}, // พาร์ทเนอร์
  type:{type: mongoose.Schema.Types.ObjectId,ref:'RoomType',required:true}, //ประเภทห้อง
  typehotelbed: {type:String},//(เฉพาะโรงแรม) (ประเภทเตียง) 
  typehotelroom:{type:String},//(เฉพาะโรงแรม)(ห้องระดับ)
  image:{ type: [String]}, //รูปห้องพัก
  partnertype:{type:String,required:true}, //(เจ้าของปล่อยเช่าและผู้เช่าปล่อยผู้เช่า)
  timebookingstart:{type:Date},//(เฉพาะผู้ปล่อยเช่า)(เวลาเริ่มต้น)
  timebookingend:{type:Date},//(เฉพาะผู้ปล่อยเช่า) (เวลาสิ้นสุด)
  nearlocation:{type:String},//(ติดกับอะไร)
  distancenearlocation:{type:Number},//(ระยะทางติดกับอะไร)
})

const Room = mongoose.model('Room', roomSchema)

module.exports = {Room,roomSchema}

