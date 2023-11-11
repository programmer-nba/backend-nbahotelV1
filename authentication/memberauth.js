const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.schema');

//เช็ค token member
verifyTokenmember = async (req,res,next) => {
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'token หมดอายุ'});
        }
        
        // ทำการยืนยันสิทธิ์ token
        const decoded =  await jwt.verify(token,secretKey)
        if(decoded.roles ==="member"){
            req.users = decoded.data
            next()    
        }
    }catch (err){
        console.log(err)
        return res.status(500).send({error:err})
    }
}


memberandpartner = async (req,res,next) => {
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'token หมดอายุ'});
        }
        
        // ทำการยืนยันสิทธิ์ token
        const decoded =  await jwt.verify(token,secretKey)
        if(decoded.roles ==="member"||decoded.roles ==="partner"){
            req.users = decoded.data
            next()    
        }
    }catch (err){
        console.log(err)
        return res.status(500).send({error:err})
    }
}

all = async (req,res,next) => {
    try{

        let token = req.headers["token"]
        const secretKey = "i#ngikanei;#aooldkhfa'"
        //เช็ค token
        if(!token){
            return res.status(403).send({status:false,message:'token หมดอายุ'});
        }
        
        // ทำการยืนยันสิทธิ์ token
        const decoded =  await jwt.verify(token,secretKey)
        req.users = decoded.data
        next()    
    }catch (err){
        console.log(err)
        return res.status(500).send({error:err})
    }
}

// isAdmin = (req,res,next)=>{
//     Admin.findById(req.UserId).exec((err,user)=>{
//         if(err){
//             res.status(500).send({message:err});
//             return;
//         }
//         Role.find({_id:{$in:user.roles}},(err,roles)=>{
//             if(err){
//                 res.status(500).send({message:err});
//                 return;
//             }
//             for(let i = 0; i<roles.length; i++){
//                 if(roles[i].name === 'admin'){
//                     next();
//                     return;
//                 }
//             }
//             res.status(403).send({message:"Require Admin Role!"});
//             return;
//         })
//     })
// };

const authJwt = {
    verifyTokenmember,
    memberandpartner,
    all
};

module.exports = authJwt;
