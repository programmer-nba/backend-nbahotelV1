const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const adminSchema = new mongoose.Schema(
  {
    telephone: {type: String, required: true,unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true,unique:true},
    roles: {type: String, required: true},
    level:{type:String, required:true},
  },
  {timestamps: true}
);

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
