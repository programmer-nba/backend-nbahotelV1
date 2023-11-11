var express = require('express');
var router = express.Router();
const adminAuth = require('../authentication/adminAuth')
const Admin = require('../models/admin.schema')
const Partner = require('../models/partner.schema')
const Member = require('../models/member.schema')
const bcrypt = require("bcryptjs")
//เรียกใช้ function เช็คชื่อและเบอร์โทรศัพท์
const checkalluser = require("../functions/check-alluser")

/* GET users listing. */
// เรียกดูข้อมูลทั้งหมดเฉพาะ admin
router.get('/',adminAuth, async(req,res)=>{
    try{    
        const admindata = await Admin.find()
        if(!admindata){
            return res.status(404).send({status:false,message:"ไม่มีข้อมูล admin"})
        }
        return res.status(200).send({status:true,data:admindata})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
})
//เรียกดูข้อมูลเฉพาะของ admin
router.get('/:id',adminAuth, async(req,res)=>{
    try{
        const id = req.params.id    
        const admindata = await Admin.findOne({_id:id})
        if(!admindata){
            return res.status(404).send({status:false,message:"ไม่มีข้อมูล admin"})
        }
        return res.status(200).send({status:true,data:admindata})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }    
})
 

// แก้ไขข้อมูลadmin

router.put('/:id',adminAuth, async (req,res)=>{
    try{
        const id = req.params.id
        const telephone = req.body.telephone
        const name = req.body.name
        //เช็คเลขซ้ำ
        const checkofadmin = await Admin.findOne({_id:id})
        if(!checkofadmin){
            return res.status(400).send({status:false,message:'ไม่มีข้อมูล admin'})
        }
        //ถ้าหา เบอร์โทรศัพท์ เหมือนกับที่ ส่งมาแสดงว่าตัวเดียวกัน
        
        if(telephone != checkofadmin.telephone)
        {
            //เช็คเบอร์โทรศัพท์ซ้ำกันไหม
            const Check = await checkalluser.Checktelephone(telephone).then((status)=>{return status})
            if(Check === true){
                return res.status(400).send({status:false,message:`เบอร์${telephone}ซ้ำ กรุณาเปลี่ยนใหม่`})
            }
            
        }
        
        if(name != checkofadmin.name){
            
            // เช็คชื่อซ้ำ
            const Checkname = await Admin.findOne({name:name})
            if(Checkname){
                return res.status(400).send({status:false,message:`ชื่อ ${name} ซ้ำ กรุณาเปลี่ยนใหม่`})
            }
        }

        const password = bcrypt.hashSync(req.body.password, 10)
        const roles = req.body.roles
        const level = req.body.level
            
        if(!telephone||!password||!name||!roles||!level){
            return res.status(400).send({status:false,message:'คุณส่งข้อมูล admin มาไม่ครบ'})
        }
        const admindata = {
            telephone: telephone,
            password :password,
            name : name,
            roles : roles,
            level : level
        }
        const editadmin = await Admin.findByIdAndUpdate(id,admindata,{ new: true })
        if(!editadmin){
            return res.status(404).send({status:false,message:"id ที่ส่งมาไม่มีในข้อมูล admin"})
        }
        return res.status(200).send({status:true,message:`อัพเดทข้อมูล${editadmin.name}สำเร็จ`,update:editadmin})

    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
})

//ลบข้อมูล member
router.delete('/:id',adminAuth, async(req,res)=>{
    try{
        const id = req.params.id
        const checkofadmin = await Admin.findOne({_id:id})
        if(!checkofadmin)
        {
            return res.status(404).send({status:false,message:"หาข้อมูลไม่เจอ Admin"})
        }
        const deleteadmin = await Admin.deleteOne({_id:id})
        if(deleteadmin){
            return res.status(200).send({status:true,message:"ลบข้อมูล Admin สำเร็จ"})
        }
    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
})


module.exports = router;