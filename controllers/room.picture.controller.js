const {Room} = require('../models/room.schema');
const multer = require("multer");
const {uploadFileCreate,deleteFile} = require('../functions/uploadfilecreate');

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
     //console.log(file.originalname);
  },
});

module.exports.Create = async (req, res) => {
    console.log(req.body);
    const id = req.params.id
    try {

    const room = await Room.findById(id);
    if(!room){
      return res.status(200).send(`Room id ${id} not found`);
    }
    
    let upload = multer({ storage: storage }).array("imgCollection", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result=[];

      if(err){
        return res.status(500).send(err);
      }

      if (!req.files) {
        res.status(200).send({ message: "มีบางอย่างผิดพลาด", status: false });
      } else {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
        const src =  await uploadFileCreate(req.files, res, { i, reqFiles });
            result.push(src);
        
          //   reqFiles.push(url + "/public/" + req.files[i].filename);

        }

        let edit = ""
        if(result){
          const data = room.image.concat(reqFiles);
          edit = await Room.findByIdAndUpdate(id,{image:data},{returnOriginal:false})
        }

        res.status(201).send({
          message: "สร้างรูปภาพเสร็จเเล้ว",
          status: true,
          room: edit ,
          file: reqFiles,
          result:result
        });
      }
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, status: false });
  }
};

//delete
module.exports.Delete = async (req,res) =>{

  const roomid = req.params.id;
  const pictureid = req.params.pictureid;

  try {

    const room = await Room.findById(roomid);

    if(!room){
      return res.status(200).send(`Room ${roomid} not found`);
    }

    await deleteFile(pictureid);
    const updatedata = room.image.filter(image => image !== pictureid);
    const deleteimages= await Room.findByIdAndUpdate(roomid,{image:updatedata},{returnOriginal:false})
    return res.status(200).send({message:true,data:deleteimages.image});
  } catch (error) {
    return res.status(500).send({ message: error.message, status: false });
  }
  
}

