const {Room} = require('../models/room.schema')
const RoomType = require('../models/room.type.schema')
const Partner = require('../models/partner.schema')
const jwt = require('jsonwebtoken');

//get all
module.exports.GetAll = async (req, res) => {
    try {
        const result = await Room.find().populate('type').populate('partner_id');
        if (!result) {
            return res.status(404).send({ message:'No Room found'});
        }
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({ message: error.message, status: false });

    }

}
//get by id
module.exports.GetById = async (req, res) => {
    const id = req.params.id;
    try {
        const find = await Room.findById(id).populate('type').populate('partner_id');
        return res.status(200).send(find);
    } catch (error) {
        return res.status(500).send({ message: error.message, status: false });
    }
}

//get all room by partner
module.exports.GetPartner = async (req,res) => {
    
    try {
         // เรียก token มาดึง partner_id
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        const decoded = jwt.verify(token,secretKey)
         // ทำการดึงข้อมูล id ใน partner
        const partner = await Partner.findOne({_id:decoded._id})

        const result = await Room.find({ partner_id: partner._id }).populate('partner_id').populate('type');
        if (!result) {
            return res.status(404).send('Hotel room not found');
        }
        return res.status(200).send(result);
        
        
    } catch (error) {
        return res.status(500).send({ message: error.message, status: false });
    
    }

       
}

module.exports.Create = async (req, res) => {

    try {
        const roomType = await RoomType.findById(req.body.type);
        if(!roomType) {
            return res.status(404).send({message:'Room type not found'});
        }

        // เรียก token มาดึง partner_id
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        const decoded =  jwt.verify(token,secretKey)
        // ทำการดึงข้อมูล id ใน partner
        const partner = await Partner.findOne({_id:decoded._id})

        const data = {
            name:req.body.name,
            description:req.body.description,
            phone_number:req.body.phone_number,
            price:req.body.price,
            type:req.body.type,
            guests:req.body.guests,
            bedroom:req.body.bedroom,
            bed:req.body.bed,
            bathroom:req.body.bathroom,
            latitude:req.body.latitude,
            longitude:req.body.longitude,
            address:req.body.address,
            tambon:req.body.tambon,
            amphure:req.body.amphure,
            province:req.body.province,
            partner_id:partner._id            
        }
        const room = new Room(data);
        const add = await room.save()
        return res.status(200).send({status:true,message:"เพิ่มข้อมูลห้องสำเร็จ",data:add})
    } catch (error) {
        return res.status(500).send({ message: error.message, status: false });

    }
}

//update
module.exports.Update = async (req, res) => {

    const id = req.params.id;

    try {

        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).send(`Room ${id} not found`);
        }
        const roomType = await RoomType.findById(req.body.type);
        if(!roomType) {
            return res.status(404).send({message:'Room type not found'});
        }
        const data = {
            name:req.body.name,
            description:req.body.description,
            phone_number:req.body.phone_number,
            price:req.body.price,
            type:req.body.type,
            guests:req.body.guests,
            bedroom:req.body.bedroom,
            bed:req.body.bed,
            bathroom:req.body.bathroom,
            latitude:req.body.latitude,
            longitude:req.body.longitude,
            address:req.body.address,
            tambon:req.body.tambon,
            amphure:req.body.amphure,
            province:req.body.province,           
        }
        const edit = await Room.findByIdAndUpdate(id,data,{ returnOriginal: false })
        return res.status(200).send({status:true,message:"แก้ไขข้อมูลห้องสำเร็จ",data:edit})
    } catch (error) {
        return res.status(500).send({ message: error.message, status: false });
    }

}

//delete
module.exports.Delete = async (req, res) => {
    const id = req.params.id;
    try {
        const deletes =await Room.findByIdAndDelete(id, null)
        return res.status(200).send({status:true,message:'ลบข้อมูลห้องสำเร็จ',data:deletes})
    } catch (error) {
        return res.status(500).send({ message: error.message, status: false });
    }
}
