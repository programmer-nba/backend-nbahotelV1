const mongoose = require('mongoose');

// Define the schema for the Hotel entity
const hotelSchema = new mongoose.Schema({
    host_id:{ type:String,required:true},
    name: { type: String, required: true },
    category: { type : {name:{type:String},description:{type:String}},required:true},
    phone_number: { type: [String],required : true},
    description: { type: String },
    address: { type: String, required: true },
    tambon: { type: String, required: true },
    amphure: { type: String, required: true },
    province : { type: String, required: true },
    country: { type: String, required: true },
    latitude: { type: Number},
    longitude: { type: Number},
    rating: { type: Number },
    total_rate: { type: Number},
    image_url: { type: [String]} ,
    amenities: { type: [{name:{type:String},description:{type:String}}] }, //สิ่งอำนวยความสะดวก
    highlight : { type: [{name:{type:String},description:{type:String}}] },
    certificate:{ type: [{name:{type:String},description:{type:String}}] },
    special_service: { type: [{name:{type:String},description:{type:String}}] },
    nearly_place: {type: [{name:{type:String},description:{type:String}}] },
    parking : { type: Boolean,default: false },
    property_policies: { type: String},
    other_information : { type: String},
    partner_id:{type: mongoose.Schema.Types.ObjectId,ref:'Partner',required:true},
    approved:{type: Boolean,default: false}
  });
  
  const Hotel = mongoose.model('Hotel', hotelSchema);



module.exports = {Hotel};