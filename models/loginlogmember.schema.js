const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const loginlogmemberSchema = new mongoose.Schema(
  {
    ipaddress: {type:String},
    member_id:{type:mongoose.Schema.Types.ObjectId,ref:'Member'}
  },
  {timestamps: true}
);

const Loginlogmember = mongoose.model("loginlogmember", loginlogmemberSchema);

module.exports = Loginlogmember;
