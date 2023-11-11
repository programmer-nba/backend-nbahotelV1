const RoomSecurity = require('../models/room.security.schema');

module.exports.GetAll = async (req,res) =>{
    try {
        const roomSecurity = await RoomSecurity.find();
        if(roomSecurity){
            return res.status(200).send(roomSecurity);
        }
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//ceate Catetory
module.exports.Create= async (req,res) =>{
    try {
        
        const data = {
            name: req.body.name,
            description : req.body.description
        }
        const roomSecurity = new RoomSecurity(data);
        const add = await roomSecurity.save()
        return res.status(200).send(add)
    } catch (error) {
        return res.status(500).send({message:err.message});
    }
    
}

//update Catetory
module.exports.Update = async (req,res) => {
    const id = req.params.id;
    try {
        const data = {
            name: req.body.name,
            description : req.body.description
        }
        const edit = await RoomSecurity.findOneAndUpdate({_id:id},data,{returnOriginal:false})
        return res.status(200).send(edit)
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete RoomSecurity
module.exports.Delete = async (req,res) => {
    try {
        const deletes = await RoomSecurity.findOneAndDelete({_id:req.params.id})
        return res.status(200).send({message:'ลบข้อมูลความปลอดภัยห้องสำเร็จ',data:deletes})
    } catch (error) {

        return res.status(500).send({message:error.message});
        
    }
}