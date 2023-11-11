const Highlight = require('../models/hotel.highlight.schema');

module.exports.GetAll = async (req,res) =>{
    try {
        const highlight = await Highlight.find()
        if(highlight){
            return res.status(200).send(highlight)
        }
    } catch (error) {
        return res.status(500).send({message:error.message})
    }
}

//ceate 
module.exports.Create= async (req,res) =>{
    try {
        
        const data = {
            name: req.body.name,
            description : req.body.description
        }
        const highlight = new Highlight(data);
        const addhighlight = await highlight.save()
        return res.status(200).send(addhighlight)
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
    
}

//update
module.exports.Update = async (req,res) => {
    const id = req.params.id;
    try {
        const data = {
            name: req.body.name,
            description : req.body.description
        }
        const edit = await Highlight.findOneAndUpdate({_id:id},data,{returnOriginal:false})
        return res.status(200).send(edit)
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete Highlight
module.exports.Delete = async (req,res) => {
    try {
        const deletes = await Highlight.findOneAndDelete({_id:req.params.id})
        return res.status(200).send(deletes)
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}