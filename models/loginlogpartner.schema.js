const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const loginlogpartnerSchema = new mongoose.Schema(
  {
    ipaddress: {type:String},
    partner_id:{type:mongoose.Schema.Types.ObjectId,ref:'Partner'}
  },
  {timestamps: true}
);

const Loginlogpartner = mongoose.model("loginlogpartner", loginlogpartnerSchema);

module.exports = Loginlogpartner;
