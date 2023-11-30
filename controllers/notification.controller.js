
const Admin = require('../models/admin.schema')
const Partner = require("../models/partner.schema");
const Member = require("../models/member.schema");
const Notification = require("../models/notification.chema")
const jwt = require("jsonwebtoken");

module.exports.getall = async (req,res) =>{
    try {
        const notification = await Notification.find({})
        return res.status(200).send({status:true,data:notification})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }
}

module.exports.getbyid = async (req,res) =>{
    try {
        const notification = await Notification.findOne({_id:req.params.id})
        return res.status(200).send({status:true,data:notification})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }
}

module.exports.getbyroles = async (req,res) =>{
    try {
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        const decoded =  jwt.verify(token,secretKey)
        let notification = "" 
        if(decoded.roles==="admin")
        {
            notification = await Notification.findOne({admin_id:decoded._id})
        }
        else if(decoded.roles==="partner")
        {
            notification = await Notification.findOne({partner_id:decoded._id})
        }else if(decoded.roles==="member")
        {
            notification = await Notification.findOne({member_id:decoded._id})
        }     
        return res.status(200).send({status:true,data:notification})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }
}

module.exports.addall = async (req, res) => {
    try {
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        const decoded =  jwt.verify(token,secretKey)
        // ทำการดึงข้อมูลadmin
        const admin = await Admin.findOne({_id:decoded._id})
        const notification = new Notification({
            admin_id:admin._id,  //(รหัสadmin)
            title: req.body.title,//(หัวข้อ)
            detail: req.body.detail//(รายละเอียด)
        })
        const add = await notification.save()
        return res.status(200).send({status:true,message:"ได้แจ้งเตือนไปให้ทุกคนเรียบร้อยแล้วแล้ว",data:add})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }

}

module.exports.addpartner = async (req, res) => {
    try {
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        const decoded =  jwt.verify(token,secretKey)
        // ทำการดึงข้อมูลadmin
        const partner = await Partner.findOne({_id:decoded._id})
        const notification = new Notification({
            partner_id:partner._id,  //(รหัสadmin)
            title: req.body.title,//(หัวข้อ)
            detail: req.body.detail//(รายละเอียด)
        })
        const add = await notification.save()
        return res.status(200).send({status:true,message:`ได้แจ้งเตือนไปให้คุณ${partner.name}เรียบร้อยแล้วแล้ว`,data:add})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }

}


module.exports.addmember = async (req, res) => {
    try {
        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        const decoded =  jwt.verify(token,secretKey)
        // ทำการดึงข้อมูลadmin
        const member = await Member.findOne({_id:decoded._id})
        const notification = new Notification({
            member_id:member._id,  //(รหัสadmin)
            title: req.body.title,//(หัวข้อ)
            detail: req.body.detail//(รายละเอียด)
        })
        const add = await notification.save()
        return res.status(200).send({status:true,message:`ได้แจ้งเตือนไปให้คุณ${member.name}เรียบร้อยแล้วแล้ว`,data:add})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }

}

module.exports.edit = async (req,res) =>{
    try {
        const id = req.params.id;
        const dataedit = {
            title: req.body.title,//(หัวข้อ)
            detail: req.body.detail//(รายละเอียด)
        }
        const edit = await Notification.findByIdAndUpdate(id,dataedit,{new:true})
        return res.status(200).send({status:true,message:'แก้ไขข้อมูลเรียบร้อยแล้ว',data:edit})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }
}

module.exports.delete = async (req,res) =>{
    try {
        const id = req.params.id
        const notification = await Notification.findByIdAndDelete(id)
        return res.status(200).send({status:true,message:"ลบข้อมูลแจ้งเตือนแล้ว",data:notification})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
      }
}
