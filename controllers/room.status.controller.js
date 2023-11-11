const RoomStatus = require('../models/room.statustype.schema');

module.exports.GetAll = async (req,res) =>{
    try {
        const roomStatus = await RoomStatus.find();
        if(roomStatus){
            return res.status(200).send(roomStatus);
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
        const roomStatus = new RoomStatus(data);
        const add = await roomStatus.save()
        return res.status(200).send(add);
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

        const edit = await RoomStatus.findOneAndUpdate({_id:id},data,{returnOriginal:false})
        return res.status(200).send(edit)
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete RoomStatus
module.exports.Delete = async (req,res) => {
    try {
        const deletes = await RoomStatus.findOneAndDelete({_id:req.params.id})
        return res.status(200).send({message:'ลบข้อมูลสถานะห้องสำเร็จ',data:deletes});
    } catch (error) {

        return res.status(500).send({message:error.message});
        
    }
}