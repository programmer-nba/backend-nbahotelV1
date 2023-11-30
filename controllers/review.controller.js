const Booking = require("../models/booking.schema")
const Review = require("../models/review.schema")
const {Room} = require("../models/room.schema")
const jwt = require("jsonwebtoken");
const { populate } = require("../models/admin.schema");

module.exports.getall = async (req,res) =>{
    try {
        const review = await Review.find({}).populate({ 
            path: "booking_id", 
            populate: [
              { path: "member_id" },
                { 
                    path: "room_id",
                    populate:[
                        {path:"partner_id"}
                    ]
                } 
            ]
          });
        return res.status(200).send({status:true,data:review})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }
}

module.exports.getbyid = async (req,res) =>{
    try {
        const review = await Review.findOne({_id:req.params.id}).populate({ 
            path: "booking_id", 
            populate: [
              { path: "member_id" },
                { 
                    path: "room_id",
                    populate:[
                        {path:"partner_id"}
                    ]
                } 
            ]
          });
        return res.status(200).send({status:true,data:review})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }
}

module.exports.getbytoken = async (req,res) =>{
    try {
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        const decoded =  jwt.verify(token,secretKey)
        let review = ""
        if(decoded.roles==="partner")
        {
            const room = Room.find({partner_id:decoded._id})
            const room_id = room.map(room=>room._id)
            const booking = await Booking.find({ room_id: { $in: room_id } })
            const booking_id = booking.map(Booking=>Booking._id)
            review =  await Review.find({booking_id:{$in:booking_id}}).populate({ 
                path: "booking_id", 
                populate: [
                  { path: "member_id" },
                    { 
                        path: "room_id",
                        populate:[
                            {path:"partner_id"}
                        ]
                    } 
                ]
              });
        }
        else if (decoded.roles ==="member")
        {
            const booking = await Booking.find({ member_id:decoded._id})
            const booking_id = booking.map(Booking=>Booking._id)
            review =  await Review.find({booking_id:{$in:booking_id}}).populate({ 
                path: "booking_id", 
                populate: [
                  { path: "member_id" },
                    { 
                        path: "room_id",
                        populate:[
                            {path:"partner_id"}
                        ]
                    } 
                ]
              });
        }
        return res.status(200).send({status:true,data:review})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }
}

module.exports.add = async (req,res)=>{
    try {
        const booking =  await Booking.findOne({_id:req.body.booking_id}).populate("room_id")
        const data = new Review({
            booking_id: booking._id,
            star: req.body.star,
            detail:req.body.detail
        })
        const add = await data.save()
        return res.status(200).send({status:true,data:add,message:`รีวิว ${booking.room_id.name} สำเร็จ`})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }
}
 
module.exports.edit = async (req,res)=>{
    try {
        const id = req.params.id
        const data = {
            star: req.body.star,
            detail:req.body.detail
        }
        const edit = await Review.findByIdAndUpdate(id,data,{new:true}).populate({ 
            path: "booking_id", 
            populate: [
              { path: "room_id" } 
            ]
          });
        return res.status(200).send({status:true,data:edit,message:`รีวิว ${edit.booking_id.room_id._name} สำเร็จ`})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }
}

module.exports.delete = async (req,res)=>{
    try {
        const id = req.params.id
        const Deletes = await Review.findByIdAndDelete(id)
        return res.status(200).send({status:true,data:Deletes,message:`ลบข้อมูลรีวิว id ${Deletes._id}`})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }
}

