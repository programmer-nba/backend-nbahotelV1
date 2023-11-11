const Amenities = require('../models/hotel.amenities.schema');

module.exports.GetAll = async (req,res) =>{
    try {
        const amenities = await Amenities.find()
        if(amenities){
            return res.status(200).send(amenities)
        }
    } catch (error) {
        return res.status(500).send({message:error.message})
    }
}


//ceate Catetory
module.exports.Create= async (req,res) =>{
    try {
        const data = {
            name: req.body.name,
            description : req.body.description
        }
        const amenities = new Amenities(data)
        const add =await amenities.save()
        if(add){
            return res.status(200).send(add)
        }            
    } catch (error) {
        return res.status(500).send({message:error.message})
        
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

       const edit = await Amenities.findOneAndUpdate({_id:id},data,{returnOriginal:false})
        res.status(200).send(edit)
    } catch (error) {
        return res.status(500).send({message:error.message})
    }
}

//delete Amenities
module.exports.Delete = async (req,res) => {
    try {
        const deletes = await Amenities.findOneAndDelete({_id:req.params.id})
        res.status(200).send(deletes)
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}