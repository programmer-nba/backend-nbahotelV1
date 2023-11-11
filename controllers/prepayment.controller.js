const {PrePayment} = require('../models/prepayment.schema');
const {Booking} = require('../models/booking.schema');
const {Hotel} = require('../models/hotel.schema');
const {Partner} = require('../models/partner.schema');
const dayjs = require('dayjs');
const {uploadFileCreate,deleteFile} = require('../functions/uploadfilecreate');
const multer = require("multer");

//set storage
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
       //console.log(file.originalname);
    },
  });

  //end set storage


module.exports.GetAll = async (req,res) =>{
    try {
        const prePayment = await PrePayment.find().populate('booking_id')
        if(prePayment){
            return res.status(200).send(prePayment);
        }
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//get Payment by hotel id
module.exports.GetHotelPaymentSlip = async (req,res) => {

    const id = req.params.id
    try {
        const payments = await PrePayment.find({hotel_id:id}).populate({
            path: "booking_id",
            populate: {
              path: "room_id",
              populate: {
                path: "hotel_id",
              },
            },
          })
        return res.status(200).send(payments);
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).send(error.message);
    }
}

//get Payment by id
module.exports.GetByid = async (req,res) => {

    const id = req.params.id
    try {
        const payments = await PrePayment.find({_id:id}).populate({
            path: "booking_id",
            populate: {
              path: "room_id",
              populate: {
                path: "hotel_id",
              },
            },
          })
        return res.status(200).send(payments);
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).send(error.message);
    }
}


// //get Hotel payment slip by id
// module.exports.GetHotelPaymentSlipByPaymentNumber = async (req,res)=>{
//     const payment_id = req.params.id;
//     try {
//         const payment = await PrePayment.findOne({_id:payment_id});
//         if(!payment){
//             return res.status(400).send({message:'payment not found'})
//         }

//         return res.status(200).send(payment);
        
//     } catch (error) {
//         console.error(error.message);
//         return res.status(500).send(error.message);
//     }
// }

// //create prepayment by hotel ID
// module.exports.CreatePrepayment = async (req,res) => {

//     try {
    
//     const now = new Date();
//     const end_date = new Date(now.getFullYear(),now.getMonth(),1);

//     const pipeline = [
//         {
//             "$unwind":{path:"$status"}
//         },
//         {
//             "$match":{
//                 $and:[
//                     {"date_to":{$lt:end_date}},
//                     {"status.name":"เช็คเอาท์"},
//                     {"confirm":"confirmed"},
//                     {"cutoff_status":false}
//                 ]
//             }
//         },
//         {
//             "$group":{
//                 "_id":{hotel:"$hotel_id",partner:"$partner_id"},
//                 "detail":{$push:{booking_id:"$_id",ref_number:"$ref_number",total:"$total_cost",status:"$status.name",check_out_date:"$date_to",partner_id:"$partner_id"}},
//                 "total_amount":{"$sum":"$total_cost"}, 
//             }
//         },
//         {
//             "$set":{
//                 hotel_id:"$_id.hotel",
//                 partner_id:"$_id.partner"
//             }
//         },
//         {
//             "$unset":["_id"]
//         }
//     ]

//         const booking = await Booking.aggregate(pipeline);

//         const count = await PrePayment.aggregate([{ $group: { _id: 0, count: { $sum: 1 } } }]);

//         const hotel = await Hotel.find({},{_id:1,name:1});
//         const partner = await Partner.find({},{_id:1,companyname:1})

//         var initnumber=null;
  
//         if(count.length>0){

//             initnumber =count[0].count
//         }
//         else{
//                 initnumber = 0;
//         }

        

//         var i = 0;

//         const prepayment_collections = [];

//         for(let book of booking){
    
//             initnumber += i;

//             const ref = `P${dayjs(Date.now()).format('YYMMDD')}${initnumber.toString().padStart(5,'0')}`;

//             const data = {
//                 hotel_name:hotel.find(el=>el._id == book.hotel_id).name,
//                 partner_name:partner.find(el=>el._id == book.partner_id).companyname,
//                 payment_number:ref
//                 ,...book
//             }

//             const prepayment = new PrePayment(data);

//             prepayment.save(async (err,response)=>{
//                 if(err){
//                     return res.status(400).send({message:err.message});
//                 }

//                 if(response){
//                     prepayment_collections.push(response.payment_number);
//                 }
                
//             });

//             i++;

//         }

//         //update booking cutoff status
                
//         var collection = [];

//         for(let item of booking){
//             for(let detail of item.detail){
//                const result = await Booking.findByIdAndUpdate(detail.booking_id,{cutoff_status:true},{returnDocument:'after'});

//                collection.push(result.ref_number);
//             }
//         }

//         //end update booking
//         if(collection.length>0){

            
//             return res.status(200).send({message:'สร้างสำเร็จ',data:collection,prepayment:prepayment_collections});
//         }else{
//             return res.status(204).send({message:'ไม่มีรายการคงค้าง'})
//         }

//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({message:error.message})
//     }

// }

// //upload slip

// module.exports.UploadSlip = async (req,res) => {

//     const id = req.params.id;
//     try {
        
    
//     const payment = await PrePayment.findById(id);

//     if(!payment){
//       return res.status(204).send({message:'ไม่มีใบรอจ่ายนี้ในรายการ'});
//     }

//     if(payment.payment_status ==='โอนเรียบร้อย'){
//         return res.status(208).send({message:'รายการนี้มีการโอนเรียบร้อยแล้ว',status:false});
//     }

//     //upload slip
    
//     let upload = multer({ storage: storage }).array("imgCollection",1);
//     upload(req, res, async function (err) {
//       const reqFiles = [];
//       const result=[];

//       console.log(req.files);

//       if (!req.files) {
//         res.status(400).send({ message: "ไม่พบ files", status: false });
//       } else {
//         // const url = req.protocol + "://" + req.get("host");

//         const i = 0;

//         const url =  await uploadFileCreate(req.files, res, { i, reqFiles });
        
//         result.push(url);

//         if(result.length>0){
//             console.log(result);
//             const dataupdate = {
//                 payment_status:'โอนเรียบร้อย',
//                 slip_image:url
//             }
//             await PrePayment.findByIdAndUpdate(id,dataupdate)
//         }

//         res.status(201).send({
//           message: "สร้างรูปภาพเสร็จเเล้ว",
//           status: true,
//           result:result
//         });
//       }
//     });

//     //end upload


// } catch (error) {
//         console.error(error);
//         return res.status(500).send({message:error.message});    
//     }

// }


