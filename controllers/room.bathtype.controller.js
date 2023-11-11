const BathType = require('../models/room.bathtype.schema');

module.exports.GetAll = async (req,res) =>{
    try {
        const roomBathType= await BathType.find();
        if(roomBathType){
            return res.status(200).send(roomBathType);
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
        const roomBathType= new BathType(data);
        const add = await roomBathType.save()
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

    const edit = await BathType.findOneAndUpdate({_id:id},data,{returnOriginal:false})
    res.status(200).send(edit)
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete RoomBathType
module.exports.Delete = async (req,res) => {
    try {
        const deletes = await BathType.findOneAndDelete({_id:req.params.id},null)
        res.status(200).send({message:'ลบข้อมูลประเภทห้องอาบน้ำสำเร็จ',data:deletes})
    } catch (error) {

        return res.status(500).send({message:error.message});
        
    }
}