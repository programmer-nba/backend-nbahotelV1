const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const contractSchema = new mongoose.Schema(
  {
    partner_id: {type:mongoose.Schema.Types.ObjectId,ref:'Partner',require:true},
    status: {type: Boolean, default:false},
    time: {type: Date},
    signature: {type: String},
    message:{type:String},
  },
  {timestamps: true}
);

const Contract = mongoose.model("contract", contractSchema);

module.exports = Contract;
