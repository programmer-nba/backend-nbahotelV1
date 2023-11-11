const RoomType = require('../models/room.type.schema');

module.exports.GetAll = async (req,res) =>{
    try {
        const roomType = await RoomType.find();
        if(roomType){
            return res.status(200).send(roomType);
        }
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//ceate Catetory
module.exports.Create= async (req,res) =>{
    try {
        
        const data = {
            name_th: req.body.name_th,
            name_en: req.body.name_en,
            description : req.body.description
        }
        const roomType = new RoomType(data);
        const add = await roomType.save()
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
            name_th: req.body.name_th,
            name_en: req.body.name_en,
            description : req.body.description
        }
        const edit = await RoomType.findOneAndUpdate({_id:id},data,{returnOriginal:false})
        return res.status(200).send(edit)
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete RoomType
module.exports.Delete = async (req,res) => {
    try {
        const deletes = await RoomType.findOneAndDelete({_id:req.params.id})
        return res.status(200).send({message:'ลบข้อมูลประเภทห้องสำเร็จ',data:deletes})
    } catch (error) {
        return res.status(500).send({message:error.message});       
    }
}