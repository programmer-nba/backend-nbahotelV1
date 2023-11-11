const RoomEntertainment = require('../models/room.entertainment.schema')

module.exports.GetAll = async (req,res) =>{
    try {
        const roomEntertainmentType = await RoomEntertainment.find();
        if(roomEntertainmentType){
            return res.status(200).send(roomEntertainmentType);
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
            description : req.body.description,
            service_time : req.body.service_time
        }
        const roomEntertainmentType = new RoomEntertainment(data);
        const add = await roomEntertainmentType.save()
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
            description : req.body.description,
            service_time : req.body.service_time
        }
        const edit = await RoomEntertainment.findOneAndUpdate({_id:id},data,{returnOriginal:false})
        return res.status(200).send(edit)
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete RoomEntertainment
module.exports.Delete = async (req,res) => {
    try {
        const deletes = await RoomEntertainment.findOneAndDelete({_id:req.params.id})
        return res.status(200).send({message:'ลบข้อมูลสิ่งให้ความบันเทิงสำเร็จ',data:deletes})
    } catch (error) {

        return res.status(500).send({message:error.message});
        
    }
}