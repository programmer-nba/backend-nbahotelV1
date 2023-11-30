const mongoose = require('mongoose')

// Define the schema for the Room entity
const reviewSchema = new mongoose.Schema({
    booking_id: {type:mongoose.Schema.Types.ObjectId,ref:'Booking'},
    star: {type:Number},
    detail:{type:String}
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review

