const Booking = require("../models/booking.schema");
const {Room} = require("../models/room.schema");
//const {Hotel} = require("../models/hotel.schema");
const Partner = require("../models/partner.schema");
const Member = require("../models/member.schema");
const Payment = require("../models/prepayment.schema");
const {PrePayment} = require('../models/prepayment.schema');

const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");
const Checkin_out = require("../models/checkin_out.schema")
// เรียกใช้ฟังกชั่น
const addgoogledrive = require("../functions/uploadfilecreate");
//ดึงข้อมูล ใน form-data ได้
const fs = require("fs");
const multer = require("multer");
const { path } = require("express/lib/application");
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
})

//สร้างข้อมูลการจอง
module.exports.addbooking = async (req, res) => {
  try {
    let token = req.headers["token"]
    const secretKey = "i#ngikanei;#aooldkhfa'"
    const decoded =  jwt.verify(token,secretKey)
    // ทำการดึงข้อมูลadmin
    const members = await Member.findOne({_id:decoded._id})
    const member_id = members._id
    const room_id = req.body.room_id;
    const date_from = req.body.date_from;
    const date_to = req.body.date_to;
    const price = req.body.price;
    //เช็คว่ารับค่ามาหรือเปล่า
    if (!member_id || !room_id || !date_from || !date_to || !price) {
      res.status(200).send({message: "กรุณากรอกข้อมูลให้ครบ"});
    }
    //เช็คว่ามีข้อมูลใน member hotel room data หรือเปล่า
    const member = await Member.findOne({_id:member_id});
    if (!member) {
      res.status(200).send({message: "หาข้อมูล member ไม่เจอ"});
    }
    const room = await Room.findOne({_id: room_id});
    if (!room) {
      res.status(200).send({message: "หาข้อมูล room ไม่เจอ"});
    }
    const newStatus = {
        statusbooking: "รอชำระเงิน",
        timestamps: new Date(),
    };
    const booking = new Booking({
      member_id: member_id,
      room_id: room_id,
      date_from: date_from,
      date_to: date_to,
      price: price,
      status:newStatus
    });
    const add = await booking.save();
    res.status(200).send({status:true,message:"จองห้องพักแล้วกรุณารอการชำระเงิน",data:add});
  } catch (error) {
    return res.status(500).send({status:false,error:error.message});
  }
}

//สร้างข้อมูลการจองแล้วจ่ายเงินอัตโนมัติ
module.exports.addbookingpayment = async (req, res) => {
  try {
    let token = req.headers["token"]
    const secretKey = "i#ngikanei;#aooldkhfa'"
    const decoded =  jwt.verify(token,secretKey)
    // ทำการดึงข้อมูลadmin
    const members = await Member.findOne({_id:decoded._id})
    const member_id = members._id
    const room_id = req.body.room_id;
    const date_from = req.body.date_from;
    const date_to = req.body.date_to;
    const price = req.body.price;
    //เช็คว่ารับค่ามาหรือเปล่า
    if (!member_id || !room_id || !date_from || !date_to || !price) {
      res.status(200).send({message: "กรุณากรอกข้อมูลให้ครบ"});
    }
    //เช็คว่ามีข้อมูลใน member hotel room data หรือเปล่า
    const member = await Member.findOne({_id:member_id});
    if (!member) {
      res.status(200).send({message: "หาข้อมูล member ไม่เจอ"});
    }
    const room = await Room.findOne({_id: room_id});
    if (!room) {
      res.status(200).send({message: "หาข้อมูล room ไม่เจอ"});
    }
    const newStatus = {
        statusbooking: "จองห้องสำเร็จ",
        timestamps: new Date(),
    };
    const booking = new Booking({
      member_id: member_id,
      room_id: room_id,
      date_from: date_from,
      date_to: date_to,
      price: price,
      status:newStatus
    });
    const add = await booking.save();
    const datapayment = new PrePayment({
      booking_id : add._id,
      total_amount : price,
      payment_status: "โอนเรียบร้อย"
    })
    const addpayment = await datapayment.save();
    const checkin = new Checkin_out({
      booking_id:add._id,
      check_in_date: '',
      check_out_date:''
    })
    const adds = await checkin.save()

    res.status(200).send({status:true,message:"จองห้องพักสำเร็จแล้ว",data:add,payment:addpayment,checkin:adds});

  } catch (error) {
    return res.status(500).send({status:false,error:error.message});
  }
}

//เรียกข้อมูลทั้งหมด
module.exports.GetAll = async (req, res) => {
  try {
    const booking = await Booking.find().populate({ path: "member_id" })
    .populate({ 
      path: "room_id", 
      populate: [
        { path: "partner_id" },
        { path: "type" } 
      ]
    });
    return res.status(200).send({status:true,data:booking});
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
};
//เรียกข้อมูลการจองตาม id
module.exports.GetByid = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findOne({_id: id})
    .populate({ path: "member_id" })
    .populate({ 
      path: "room_id", 
      populate: [
        { path: "partner_id" },
        { path: "type" } 
      ]
    });;
    if (!booking) {
      return res.status(200).send("หาข้อมูล booking ไม่เจอ");
    }
    return res.status(200).send(booking);
  } catch (error) {
    return res.status(500).send({status:false,error:error.message});
  }
};

//เรียกข้อมูลการจองตาม room_id
module.exports.GetByroom = async (req, res) => {
  try {
    const room_id = req.params.id;
    const booking = await Booking.findOne({room_id: room_id}).populate("member_id").populate("room_id");
    if (!booking) {
      return res.status(200).send("หาข้อมูล booking ไม่เจอ");
    }
    return res.status(200).send(booking);
  } catch (error) {
    return res.status(500).send({status:false,error:error.message});
  }
};
//เรียกข้อมูลการจองตาม member
module.exports.GetBymember = async (req, res) => {
  try {
    let token = req.headers["token"]
    const secretKey = "i#ngikanei;#aooldkhfa'"
    const decoded =  jwt.verify(token,secretKey)
    const member = await Member.findOne({_id:decoded._id})
    const member_id = member._id;
    const booking = await Booking.find({member_id: member_id}).populate("member_id").populate("room_id");
    if (!booking) {
      return res.status(200).send("หาข้อมูล booking ไม่เจอ");
    }
    return res.status(200).send({status:true,data:booking});
  } catch (error) {
    return res.status(500).send({status:false,error:error.message});
  }
};

//เรียกข้อมูลการจองตาม partner
module.exports.GetBypartner = async (req, res) => {
  try {
    let token = req.headers["token"]
    const secretKey = "i#ngikanei;#aooldkhfa'"
    const decoded =  jwt.verify(token,secretKey)
    const partner = await Partner.findOne({_id:decoded._id})
    const room = await Room.find({partner_id:partner._id}) 
    const room_id = room.map(room=>room._id)
    const booking = await Booking.find({ room_id: { $in: room_id } }) .populate({ path: "member_id" })
    .populate({ 
      path: "room_id", 
      populate: [
        { path: "partner_id" },
        { path: "type" } 
      ]
    });
  
    if (!booking) {
      return res.status(200).send("หาข้อมูล booking ไม่เจอ");
    }
    return res.status(200).send({status:true,data:booking});
  } catch (error) {
    return res.status(500).send({status:false,error:error.message});
  }
};
//เรียกข้อมูลการจองตาม partner และ เรียกข้อมูล payment มาด้วย
module.exports.GetBypartnerandpayment = async (req, res) => {
  try {
    let token = req.headers["token"]
    const secretKey = "i#ngikanei;#aooldkhfa'"
    const decoded =  jwt.verify(token,secretKey)
    const partner = await Partner.findOne({_id:decoded._id})
    const room = await Room.find({partner_id:partner._id}) 
    const room_id = room.map(room=>room._id)
    const booking = await Booking.find({ room_id: { $in: room_id } }) .populate({ path: "member_id" })
    .populate({ 
      path: "room_id", 
      populate: [
        { path: "partner_id" },
        { path: "type" } 
      ]
    });
  
    if (!booking) {
      return res.status(200).send("หาข้อมูล booking ไม่เจอ");
    }
    const book_id = booking.map(booking=>booking._id)
    const payment = await Payment.PrePayment.find({booking_id:{$in:book_id}})

    return res.status(200).send({status:true,data:booking,payment:payment});
  } catch (error) {
    return res.status(500).send({status:false,error:error.message});
  }
};

//member ชำระเงิน
module.exports.Payment = async (req, res) => {

  try {  
    //อัพโหลดไฟล์ลงใน google ไดร์ฟ
    // สร้าง middleware 
    let upload = multer({storage: storage}).array("slip_image", 20);
    upload(req, res, async (err) => {
      const reqFiles = [];
      //console.log(req.files)
      //เช็คว่าไฟล์มาไหม
      if (!req.files) {
        res.status(200).send({message: "มีบางอย่างผิดพลาด", status: false});
      } else {
        //ถ้ามา
        const url = req.protocol + "://" + req.get("host");
        // console.log(req.files)
        for (var i = 0; i < req.files.length; i++) {
          await addgoogledrive.uploadFileCreate(req.files, res, {i, reqFiles});
        //   console.log(reqFiles)
        }
      }
      //จบส่วนอัพโหลดรูป

    const id = req.params.id
    const newStatus = {
      statusbooking: "ยีนยันการชำระเงิน",
      timestamps: new Date(),
    };
    const bookingdata = await Booking.findOne({_id: id});
    if (!bookingdata) {
      return res.status(200).send({status: false, message: "id ที่ส่งมาไม่มีในข้อมูล Booking"});
    }
    // เพิ่มหลักฐานการจ่ายเงิน
    const booking_id = bookingdata._id;
    const total_amount = bookingdata.price;
    const [slip_image] = reqFiles
    console.log(slip_image)
    //เพิ่มข้อมูล payment
    const paymentdata = new Payment.PrePayment({
        booking_id : booking_id,
        total_amount : total_amount,
        slip_image: slip_image
    })
    const addpayment = await paymentdata.save()
    //แก้ไขข้อมูล
    const editpaymentid = await Booking.findByIdAndUpdate({_id:id},{$push:{status:newStatus}},{new:true})
    if(!editpaymentid){
        return res.status(200).send({status:false,message:"id ที่ส่งมาไม่มีในข้อมูล Booking"})
    }
    return res.status(200).send({status:true,message:`คุณได้ส่งหลักฐานการชำระเงินเรียบร้อย แล้วรอยืนยันการชำระเงิน`,update:editpaymentid,payment:addpayment,file:reqFiles})
    })

   
   
    
  } catch (error) {
    return res.status(500).send({status:false,error:error.message});
  }
};

// partner ยืนยันชำระเงิน
module.exports.confirmbookingpayment = async (req, res) => {
  try{
    const payment_id = req.params.id; // payment_id
  //เพิ่มสถานะ
  const newStatus = {
    statusbooking: "จองห้องสำเร็จ",
    timestamps: new Date(),
  };
  //แก้ไขสถานะ payment
  const payment_status = "โอนเรียบร้อย";
  const editpayment = await Payment.PrePayment.findByIdAndUpdate(
    {_id: payment_id},
    {payment_status: payment_status},
    {new: true}
  );
  if (!editpayment) {
    return res
      .status(200)
      .send({status: false, message: "id ที่ส่งมาไม่มีในข้อมูล Payment"});
  }
  const editbooking = await Booking.findByIdAndUpdate(
    {_id: editpayment.booking_id},
    {$push: {status: newStatus}},
    {new: true}
  ).populate("member_id").populate("room_id");

  if (!editbooking) {
    return res
      .status(200)
      .send({status: false, message: "id ที่ส่งมาไม่มีในข้อมูล Booking"});
  }
  const checkin = new Checkin_out({
    booking_id:editpayment.booking_id,
    check_in_date: '',
    check_out_date:''
  })
  const add = await checkin.save()

  return res.status(200).send({
    status: true,
    message: `ข้อมูล ${editbooking._id} ได้รับการยืนยันการชำระเงินแล้ว จองห้องพักสำเร็จ`,
    booking: editbooking,
    payment: editpayment,
    checkin:add
  });
  }catch(error){
    return res.status(500).send({status:false,error:error.message});
  }
  
};

// partner ไม่ยืนยันการชำระเงิน
module.exports.unconfirmbookingpayment = async (req, res) => {
  const payment_id = req.params.id
  //เพิ่มสถานะ
  const newStatus = {
    statusbooking: "ชำระเงินไม่สำเร็จ",
    timestamps: new Date(),
  };
  //หาข้อมูล booking id
  const findbooking = await Payment.PrePayment.findOne({_id:payment_id})
  if(!findbooking){
    return res.status(200).send({status: false, message: "id ที่ส่งมาไม่มีในข้อมูล Payment_id"})
  }
  //เพิ่มสถานะ booking
  const editbooking = await Booking.findByIdAndUpdate(
    {_id: findbooking.booking_id},
    {$push: {status: newStatus}},
    {new: true}
  )
  if (!editbooking) {
    return res.status(200).send({status: false, message: "id ที่ส่งมาไม่มีในข้อมูล Booking"})
  }
  return res.status(200).send({
    status: true,
    message: `ข้อมูล ${editbooking._id} กรุณาส่งหลักฐานยืนยันการชำระเงินมาใหม่ เนื่องจาก partner ไม่เจอหลักฐานการชำระเงินของคุณ กรุณาชำระเงินใหม่`,
    booking: editbooking,
    payment: findbooking,
  });
};

module.exports.getpaymentall = async (req, res) => {
  try {
    const payment = await Payment.PrePayment.find().populate({ 
      path: "booking_id", 
      populate: [
        { path: "member_id" },
        { 
          path: "room_id",
          populate:[
            {path:"partner_id"},
            {path:"type"}
          ] 
        } 
      ]
    })
    return res.status(200).send({status:true,payment:payment});
  } catch (error) {
    return res.status(500).send({status:false,error:error.message});
  }
}

module.exports.getpaymentbyid = async (req, res) => {
  try {
    const payment = await Payment.PrePayment.findById(req.params.id).populate({ 
      path: "booking_id", 
      populate: [
        { path: "member_id" },
        { 
          path: "room_id",
          populate:[
            {path:"partner_id"},
            {path:"type"}
          ] 
        } 
      ]
    })
    return res.status(200).send({status:true,payment:payment});
  } catch (error) {
    return res.status(500).send({status:false,error:error.message});
  }
}

module.exports.delete = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id)
    const payment = await Payment.PrePayment.findOneAndDelete({ booking_id:req.params.id})
    return res.status(200).send({status:true,data:booking,payment:payment});

  } catch (error) {
    return res.status(500).send({status:false,error:error.message});
  }
}


