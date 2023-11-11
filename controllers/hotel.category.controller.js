const Category = require('../models/hotel.category.schema');



module.exports.GetAll = async (req,res) =>{
    try {
        const category = await Category.find();
        if(category){
            return res.status(200).send(category);
        }
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//ceate Catetory
module.exports.Create= async (req,res) =>{
    try {
        const categorydata = new Category({
            name: req.body.name,
            description : req.body.description
        })

        await categorydata.save().then(savecategory=>{
            return res.status(200).send(savecategory);
        })
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
       const editcategoryhotel= await Category.findByIdAndUpdate(id,data,{ new: true })
       if(!editcategoryhotel){
        return res.status(404).send({status:false,message:"แก้ไขข้อมูลล้มเหลว"})
        }
       res.send(editcategoryhotel)

    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}

//delete Category
module.exports.Delete = async (req,res) => {
    try {
        const deletecategory = await Category.findOneAndDelete({_id:req.params.id})
        if(deletecategory){
            res.status(200).send(deletecategory)
        }       
    } catch (error) {

        return res.status(500).send({message:error.message});
        
    }
}