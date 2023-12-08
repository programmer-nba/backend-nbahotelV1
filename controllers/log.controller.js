const Loginlogadmin = require('../models/loginlogadmin.schema')
const Loginlogmember = require('../models/loginlogmember.schema');
const Loginlogpartner = require('../models/loginlogpartner.schema');


//admin
module.exports.Getlogadmin = async (req, res) => {
    try{
        const result = await Loginlogadmin.find().populate('admin_id');
        if (!result) {
            return res.status(200).send({ message:'Not found'});
        }
        return res.status(200).send(result);
    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
}

module.exports.Deletelogadmin = async (req,res) =>{
    try{
        const id = req.params.id;
        const deletes =await Loginlogadmin.findByIdAndDelete(id, null)
        return res.status(200).send({status:true,message:'ลบข้อมูลห้องสำเร็จ',data:deletes})
    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
}
//partner
module.exports.Getlogpartner = async (req, res) => {
    try{
        const result = await Loginlogpartner.find().populate('partner_id');
        if (!result) {
            return res.status(200).send({ message:'Not found'});
        }
        return res.status(200).send(result);
    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
}

module.exports.Deletelogpartner = async (req,res) =>{
    try{
        const id = req.params.id;
        const deletes =await Loginlogpartner.findByIdAndDelete(id, null)
        return res.status(200).send({status:true,message:'ลบข้อมูลห้องสำเร็จ',data:deletes})
    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
}
//member
module.exports.Getlogmember = async (req, res) => {
    try{
        const result = await Loginlogmember.find().populate('member_id');
        if (!result) {
            return res.status(200).send({ message:'Not found'});
        }
        return res.status(200).send(result);
    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
}

module.exports.Deletelogmember = async (req,res) =>{
    try{
        const id = req.params.id;
        const deletes =await Loginlogmember.findByIdAndDelete(id, null)
        return res.status(200).send({status:true,message:'ลบข้อมูลห้องสำเร็จ',data:deletes})
    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
}

