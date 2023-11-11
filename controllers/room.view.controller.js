const RoomView = require('../models/room.viewtype.schema');

module.exports.GetAll = async (req,res) =>{
    try {
        const roomView = await RoomView.find();
        if(roomView){
            return res.status(200).send(roomView);
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
        const roomView = new RoomView(data);
        const add = await roomView.save()
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
        const edit = await RoomView.findOneAndUpdate({_id:id},data,{returnOriginal:false})
        return res.status(200).send(edit)
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete RoomView
module.exports.Delete = async (req,res) => {
    try {
        const deletes = await RoomView.findOneAndDelete({_id:req.params.id})
        return res.status(200).send({message:'ลบข้อมูลวิวห้องสำเร็จ',data:deletes})
    } catch (error) {

        return res.status(500).send({message:error.message});
        
    }
}