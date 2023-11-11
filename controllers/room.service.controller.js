const RoomService = require('../models/room.service.schema');

module.exports.GetAll = async (req,res) =>{
    try {
        const roomService = await RoomService.find();
        if(roomService){
            return res.status(200).send(roomService);
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
        const roomService = new RoomService(data);
        const add = await roomService.save()
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
        const edit = await RoomService.findOneAndUpdate({_id:id},data,{returnOriginal:false})
        return res.status(200).send(edit)
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete RoomService
module.exports.Delete = async (req,res) => {
    try {
        const deletes = await RoomService.findOneAndDelete({_id:req.params.id})
        return res.status(200).send({message:'ลบข้อมูลบริการรูมเซอร์วิสสำเร็จ',data:deletes})
    } catch (error) {
        return res.status(500).send({message:error.message})
    }
}