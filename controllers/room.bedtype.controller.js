const BedType = require('../models/room.bedtype.schema');

module.exports.GetAll = async (req, res) => {
    try {
        const bedTypes = await BedType.find();
        res.status(200).send(bedTypes);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

//ceate Catetory
module.exports.Create= async (req,res) =>{
    try {
        const data = {
            name: req.body.name,
            description : req.body.description
        }
        const roomBed = new BedType(data)
        const add = await roomBed.save()
        return res.status(200).send(add)
    } catch (error) {
        return res.status(500).send({message:error.message});
        
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
        const edit = await BedType.findOneAndUpdate({_id:id},data,{returnOriginal:false})
        res.status(200).send(edit)
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete BedType
module.exports.Delete = async (req,res) => {
    try {
        const deletes= await BedType.findOneAndDelete({_id:req.params.id})
        res.status(200).send({message:'ลบข้อมูลประเภทเตียงนอนสำเร็จ',data:deletes})
    } catch (error) {

        return res.status(500).send({message:error.message});
        
    }
}