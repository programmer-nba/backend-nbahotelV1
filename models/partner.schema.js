const mongoose = require('mongoose')

// Define the schema for the Booking entity
const partnerSchema = new mongoose.Schema({
  telephone: {type: String, required: true,unique: true},
  password:{type: String , required:true},
  name: {type: String,required:true},
  idcard:{type:String,require:true},
  image_idcard:{ type: [String]},
  address: { type: String, required: true },
  tambon: { type: String, required: true },
  amphure: { type: String, required: true },
  province : { type: String, required: true },
  level:{type:String,required:true},
  statusbooking:{type:Boolean,default:false}, 
  token: {type: String,required: false,default:''},
  webhook: {type: String,required: false,default:''},
  status:{type:Boolean,default: false},
  email:{type:String},
  bank:{type:String},
  numberbank:{type:String},
  image_bank:{type:[String]},
  approve : {
    type: [
      {
        statusapprove: { type: String, default: 'รออนุมัติ' },
        timestamps: { type: Date, default: Date.now }
      }
    ],
    default: [{ statusapprove: 'รออนุมัติ', timestamps: new Date()}]
  }
},
  {timestamps: true})
  const Partner = mongoose.model('Partner', partnerSchema)

module.exports = Partner
