const Certificate = require('../models/hotel.certificate.schema');

module.exports.GetAll = async (req,res) =>{
    try {
        const certificate = await Certificate.find();
        if(certificate){
            return res.status(200).send(certificate)
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
        const certificate = new Certificate(data)
        const addhighlight = await certificate.save()
        return res.status(200).send(addhighlight)
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
        const edit = await Certificate.findOneAndUpdate({_id:id},data,{returnOriginal:false})
        return res.status(200).send(edit)
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete Certificate
module.exports.Delete = async (req,res) => {
    try {
        const deletes = await Certificate.findOneAndDelete({_id:req.params.id})
        return res.status(200).send(deletes)
    } catch (error) {
        return res.status(500).send({message:error.message});
        
    }
}