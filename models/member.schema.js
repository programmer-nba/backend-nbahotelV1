const mongoose = require('mongoose');

// Define the schema for the HotelUser entity
const MemberSchema = new mongoose.Schema({
  telephone: {type: String, required: true,unique: true},
  password: { type: String, required: true },
  name :{type :String,required: true ,unique:true} ,
  firstname:{ type: String},
  lastname:{ type: String},
  email: { type: String},
  telephone_inviter:{type: String,},
  roles:{type: String, required: true},
  service_name:{ type: String},
  service_id:{ type: String},
  approved:{type:Boolean,default:false}
});


const Member = mongoose.model('Member', MemberSchema);

module.exports = Member;