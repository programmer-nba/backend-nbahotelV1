const Admin = require('../models/admin.schema')
const Partner = require('../models/partner.schema')
const Member = require('../models/member.schema')
//สร้าง function เช็คเลขโทรศัพท์ซ้ำ
async function Checktelephone(telephone){
    const checkAdmin = await Admin.findOne({telephone:telephone})
    if(checkAdmin) return true
    const checkPartner = await Partner.findOne({telephone:telephone})
    if(checkPartner) return true
    const checkMember = await Member.findOne({telephone:telephone})
    if(checkMember) return true    
    return false
}

//สร้าง fuction เช็คชื่อซ้ำ
async function Checknames(name){
    const checkAdmin = await Admin.findOne({name:name})
    if(checkAdmin) return true
    const checkPartner = await Partner.findOne({name:name})
    if(checkPartner) return true
    const checkMember = await Member.findOne({name:name})
    if(checkMember) return true    
    return false
}

const checkalluse = {
    Checktelephone,
    Checknames
};
module.exports = checkalluse