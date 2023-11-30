const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const contractmemberSchema = new mongoose.Schema(
  {
    member_id: {type:mongoose.Schema.Types.ObjectId,ref:'Member',require:true},
    status: {type: Boolean, default:false},
    time: {type: Date},
    signature: {type: String},
    message:{type:String},
  },
  {timestamps: true}
);

const ContractMember = mongoose.model("contractmember", contractmemberSchema);

module.exports = ContractMember;
