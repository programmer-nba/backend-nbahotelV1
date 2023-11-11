const {Hotel}= require('../models/hotel.schema');
const {uploadFileCreate,deleteFile} = require('../functions/uploadfilecreate');
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
     //console.log(file.originalname);
  },
});

module.exports.Create = async (req, res) => {

    const id = req.params.id;
    try {
    const hotel = await Hotel.findById(id);
    if(!hotel){
      return res.status(404).send(`Hotel id ${id} not found`);
    }

    let upload = multer({ storage: storage }).array("imgCollection", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result=[];

      if (!req.files) {
        res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
      } else {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
        const url =  await uploadFileCreate(req.files, res, { i, reqFiles });
            result.push(url);
        
          //   reqFiles.push(url + "/public/" + req.files[i].filename);
        }
        let edit = ""
        if(result){
          const data = hotel.image_url.concat(reqFiles);
          edit = await Hotel.findByIdAndUpdate(id,{image_url:data},{returnOriginal:false})
        }

        res.status(201).send({
          message: "สร้างรูปภาพเสร็จเเล้ว",
          status: true,
          hotel:edit,
          file: reqFiles,
          result:result,
        });
      }
    });
  } catch (error) {
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
}

//delele picture

module.exports.Delete = async (req,res) => {
  const hotelid = req.params.id;
  const pictureid = req.params.pictureid;

  try {

  const hotel = await Hotel.findById(hotelid);

  if(!hotel){
      return res.status(404).send(`Room ${hotelid} not found`);
  }

  await deleteFile(pictureid);
  const updatedata = hotel.image_url.filter(image => image !== pictureid)
  await Hotel.findByIdAndUpdate(hotelid,{image_url:updatedata},{returnOriginal:false})
  return res.status(200).send(hotel.image_url)

  } catch (error) {
    return res.status(500).send(error);
  }
}
