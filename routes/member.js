var express = require('express');
var router = express.Router();
//var sessionAuth = require('../authentication/sessionAuth');
const Admin = require('../models/admin.schema')
const Partner = require('../models/partner.schema')
const Member = require('../models/member.schema')
const memberAuth = require('../authentication/memberauth')
const adminAuth = require('../authentication/adminAuth')
const bcrypt = require("bcryptjs")
//เรียกใช้ function เช็คชื่อและเบอร์โทรศัพท์
const checkalluser = require("../functions/check-alluser")
/* GET users listing. */
// เรียกดูข้อมูลทั้งหมดเฉพาะ admin
router.get('/',adminAuth, async(req,res)=>{
    try{
        const memberdata = await Member.find()
        if(!memberdata){
            return res.status(404).send({status:false,message:"ไม่มีข้อมูล member"})
        }
        return res.status(200).send({status:true,data:memberdata})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
})

//เรียกดูข้อมูลเฉพาะของ member
router.get('/:id',memberAuth.verifyTokenmember, async(req,res)=>{
    try{
        const id = req.params.id
        const memberdata = await Member.findOne({_id:id})
        if(!memberdata){
            return res.status(404).send({status:false,message:"ไม่มีข้อมูล member"})
        }
        return res.status(200).send({status:true,data:memberdata})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
})

// เรียกดูข้อมูลmemberเฉพาะ ของ admin
router.get('/admin/:id',adminAuth, async(req,res)=>{
    try{
        const id = req.params.id
        const memberdata = await Member.findOne({_id:id})
        if(!memberdata){
            return res.status(404).send({status:false,message:"ไม่มีข้อมูล member"})
        }
        
        return res.status(200).send({status:true,data:memberdata})
    }catch (error) {
        return res.status(500).send({status:false,error:error.message});
    }
})

// แก้ไขข้อมูลmember
router.put('/:id',memberAuth.verifyTokenmember, async (req,res)=>{
    try{
        const id = req.params.id
        const telephone = req.body.telephone
        const name = req.body.name
        //เช็คเลขซ้ำ

        const checkofmember = await Member.findOne({_id:id})
        //ถ้าหา เบอร์โทรศัพท์ เหมือนกับที่ ส่งมาแสดงว่าตัวเดียวกัน
        if(telephone != checkofmember.telephone)
        {
            //เช็คเบอร์โทรศัพท์ซ้ำกันไหม
            const Check = await checkalluser.Checktelephone(telephone).then((status)=>{return status})
            if(Check === true){
                return res.status(400).send({status:false,message:`เบอร์${telephone}ซ้ำ กรุณาเปลี่ยนใหม่`})
            }
            
        }
        if(name != checkofmember.name){
            // เช็คชื่อซ้ำ
            const Checkname = await Member.findOne({name:name})
            if(Checkname){
                return res.status(400).send({status:false,message:`ชื่อ ${name} ซ้ำ กรุณาเปลี่ยนใหม่`})
            }
        }

        const password = bcrypt.hashSync(req.body.password, 10)
        const firstname = req.body.firstname
        const lastname =  req.body.lastname
        const email = req.body.email    
        if(!telephone||!password||!name||!firstname||!lastname||!email){
            return res.status(400).send({status:false,message:'คุณส่งข้อมูล member มาไม่ครบ'})
        }
        const memberdata = {
            telephone: telephone,
            password :password,
            name : name,
            firstname : firstname,
            lastname : lastname,
            email : email
        }
        const editmember = await Member.findByIdAndUpdate(id,memberdata,{ new: true })
        if(!editmember){
            return res.status(404).send({status:false,message:"id ที่ส่งมาไม่มีในข้อมูล member"})
        }
        return res.status(200).send({status:true,message:`อัพเดทข้อมูล ${editmember.name} สำเร็จ`,update:editmember})

    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
})

//ลบข้อมูล member
 router.delete('/:id',memberAuth.verifyTokenmember, async(req,res)=>{
    try{
        const id = req.params.id
        const checkofmember = await Member.findOne({_id:id})
        if(!checkofmember)
        {
            return res.status(404).send({status:false,message:"หาข้อมูลไม่เจอ Member"})
        }
        const deleteMember = await Member.deleteOne({_id:id})
        if(deleteMember){
            return res.status(200).send({status:true,message:"ลบข้อมูล Member สำเร็จ"})
        }
    }catch(error){
        return res.status(500).send({status:false,error:error.message});
    }
 })



// router.get('/:id',MemberAuth, User.getById);

// router.post('/me',sessionAuth,User.Me);

// router.post('/signout',sessionAuth,User.SignOut);

// //update user
// router.patch('/update/:id',MemberAuth,User.Update);


// //approve user
// router.patch('/approved/:id',adminAuth,User.Approved);

// //create user service
// router.patch('/userservice/:id',MemberAuth,User.CreateUserService);

module.exports = router;
