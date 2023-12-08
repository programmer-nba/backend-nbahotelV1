const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const loginlogadminSchema = new mongoose.Schema(
  {
    ipaddress: {type:String},
    admin_id:{type:mongoose.Schema.Types.ObjectId,ref:'admin'}
  },
  {timestamps: true}
);

const Loginlogadmin = mongoose.model("loginlogadmin", loginlogadminSchema);

module.exports = Loginlogadmin;
