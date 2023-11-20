const {Room} = require('../models/room.schema')
const Partner = require('../models/partner.schema')
const jwt = require('jsonwebtoken');

module.exports.approve = async (req,res)=>{
    try{
        const id = req.params.id
        const newStatus = {
            statusapprove: 'อนุมัติ',
            timestamps: new Date()
        };
        const approveroom = await Room.findByIdAndUpdate({ _id: id },{ $push: { approve: newStatus },status:true },{ new: true })
        if(!approveroom){
            return res.status(404).send({status:false,message:"id ที่ส่งมาไม่มีในข้อมูล room"})
        }
        return res.status(200).send({status:true,message:`ข้อมูล ${approveroom.name} ได้รับการอนุมัติ`,update:approveroom})
    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
}

module.exports.unapprove = async (req,res)=>{
    try{
        const id = req.params.id
        const newStatus = {
            statusapprove: 'ไม่อนุมัติ',
            timestamps: new Date()
        };
        const approveroom = await Room.findByIdAndUpdate({ _id: id },{ $push: { approve: newStatus },status:false },{ new: true })
        if(!approveroom){
            return res.status(404).send({status:false,message:"id ที่ส่งมาไม่มีในข้อมูล room"})
        }
        return res.status(200).send({status:true,message:`ข้อมูล ${approveroom.name} ได้รับการไม่อนุมัติ`,update:approveroom})
    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }    
}

module.exports.openstatus = async (req,res)=>{
    try{
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        const decoded =  await jwt.verify(token,secretKey)
        // ทำการดึงข้อมูล id ใน partner
        const partner = await Partner.findOne({name:decoded.name})
        if(!partner)
        {
            return res.status(404).send({status:false,message:'หา id partner ไม่เจอ'})
        }
        const room = await Room.findByIdAndUpdate({partner_id:})

    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }  
    
}

module.exports.closestatus = async (req,res)=>{
    const id = req.params.id
}