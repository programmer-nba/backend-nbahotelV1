const FurnitureType = require('../models/room.furniture.schma');

module.exports.GetAll = async (req,res) =>{
    try {
        const furnitureType = await FurnitureType.find();
        if(furnitureType){
            return res.status(200).send(furnitureType);
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
        const furnitureType = new FurnitureType(data);
        const add = await furnitureType.save()
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

        const edit = await FurnitureType.findOneAndUpdate({_id:id},data,{returnOriginal:false})
        return res.status(200).send(edit)
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete FurnitureType
module.exports.Delete = async (req,res) => {
    try {
        const deletes = await FurnitureType.findOneAndDelete({_id:req.params.id})
        return res.status(200).send({message:'ลบข้อมูลประเภทเฟอร์นิเจอร์',data:deletes})
    } catch (error) {

        return res.status(500).send({message:error.message});
        
    }
}