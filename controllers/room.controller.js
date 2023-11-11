
const {Room} = require('../models/room.schema')
const AirType = require('../models/aircondition.schema');
const BedType = require('../models/room.bedtype.schema');
const BathType = require('../models/room.bathtype.schema');
const FurnitureType = require('../models/room.furniture.schma')
const RoomAmenities = require('../models/room.amenities.schema')
const RoomEntertainment = require('../models/room.entertainment.schema')
const RoomStatus = require('../models/room.statustype.schema')
const RoomView = require('../models/room.viewtype.schema')
const RoomService = require('../models/room.security.schema')
const RoomType = require('../models/room.type.schema')
const { Hotel } = require('../models/hotel.schema');
const SecurityType = require('../models/room.security.schema');



//get all
module.exports.GetAll = async (req, res) => {
    try {
        const result = await Room.find();
        if (!result) {
            return res.status(404).send({ message:'No Room found'});
        }
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({ message: error.message });

    }

}
//get by id
module.exports.GetById = async (req, res) => {
    const id = req.params.id;
    try {
        const find = await Room.findById(id)
        return res.status(200).send(find);
    } catch (error) {
        res.send(error);
    }
}

//get all room by hotel id
module.exports.GetHotelRoom = async (req,res) => {
    const id = req.params.id;
    try {
        const result = await Room.find({ hotel_id: id });
        if (!result) {
            return res.status(404).send('Hotel room not found');
        }
        return res.status(200).send(result);
        
        
    } catch (error) {
        return res.status(500).send({error:error.message});
        
    }

       
}



module.exports.Create = async (req, res) => {

    try {

        const hotel = await Hotel.findById(req.body.hotel_id);
        if(!hotel){
            return res.status(404).send({message:'Hotel not found!'});
        }

        const airType = await AirType.findById(req.body.aircondition);
        

        if(!airType){
            return res.status(404).send({message:'Air type not found'});
        }

        const roomType = await RoomType.findById(req.body.room_type);
        
        if(!roomType) {
            return res.status(404).send({message:'Room type not found'});
        }

        const bedType = await BedType.findById(req.body.bed_type);
        
        if (!bedType) {
            return res.status(404).send({ message:"Bed type not found" });
        }

        //furnitures
        const furnitures = [];

       for (let el of  req.body.furniture){

           const container = await FurnitureType.findById(el);
           if (container) {
               furnitures.push(container);
            }
        }
       
        

        //amenities
        const amenities = [];

        for(let el of req.body.amenities){

            const container = await RoomAmenities.findById(el);
            if (container) {
                amenities.push(container);
            }
            
        }



        //Entertainments
        const entertainments = [];

        for (let el of  req.body.entertainment){

            const container = await RoomEntertainment.findById(el);
            if (container) {
                entertainments.push(container);
            }
        }
   

        //Room services
        const roomServices = [];

        for (let el of  req.body.room_service ){

            const container = await RoomService.findById(el);
            if (container) {
                console.log('room service', container);
                roomServices.push(container);
            }
            else {
                console.log('no room service');
            }
        }
        

        //Status
        const status = await RoomStatus.findById(req.body.status);

        if (!status) {
            return res.status(404).send({ message: 'invalid status' });
        }


        //View 
        const view = await RoomView.findById(req.body.view_type);
        if (!view) {
            return res.status(404).send({ message: 'invalid view' });
        }

        //Bath
        const bath = await BathType.findById(req.body.bath_type);
        if (!bath) {
            return res.status(404).send({ message: 'invalid bath id' });
        }

        //Security
        const security = await SecurityType.findById(req.body.security)
        if(!security){
            return res.status(404).send({ message: 'invalid security id'});
        }

 

        const data = {
            hotel_id: req.body.hotel_id,
            type: roomType,
            imageURl: req.body.image_url, // array
            detail: req.body.detail,
            price: req.body.price, //number
            cost:req.body.cost,
            quota:req.body.quota,
            unit:req.body.unit,
            //highlight
            size: req.body.size, // number <=> sqm.
            bed_type: { name: bedType.name, description: bedType.description }, // id from bed type
            aircondition:{name:airType.name, description:airType.description},
            max_person: req.body.max_person,
            children: req.body.children, // true if no charge for children
            view_type: { name: view.name, description: view.description },
            bath_type: { name: bath.name, description: bath.description },
            smoke_type: req.body.smoke_type, // true if allow to smoke
            furniture: furnitures, //array
            room_service: roomServices, //default room service apply to this room
            amenities: amenities,
            // entertainment
            wifi: req.body.wifi, // true if available
            entertainment: entertainments, // array
            // security
            security: security, //object of security
            // promotion
            promotions: req.body.promotions, //array available for multiple promotion
            // status
            status: { name: status.name, description: status.description }, //avariable,busy,maintenance
            
        }
        const room = new Room(data);
        const add = await room.save()
        return res.status(200).send(add)
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error });

    }
}




//update
module.exports.Update = async (req, res) => {

    const id = req.params.id;

    try {

    const room = await Room.findById(id);

        if (!room) {
            return res.status(404).send(`Room ${id} not found`);
        }

        let roomType = await RoomType.findById(req.body.room_type);

        if(!roomType){
            roomType = room.type;
        }

        let bedType = await BedType.findById(req.body.bed_type);

        if(!bedType){
            bedType = room.bed_type;
        }

        let airType = await AirType.findById(req.body.aircondition);

        if(!airType){
            airType = room.aircondition;
        }

        //Security
        let security = await SecurityType.findById(req.body.security)
        if(!security){
            security = room.security;
        }

        //furnitures
        let furnitures = [];
        if(req.body.furniture){

           for(let el of req.body.furniture){

               const container = await FurnitureType.findById(el);
               if (container) {
                   furnitures.push(container);
                }
                
            }
        }
        

        //amenities
        let amenities = [];

        if(req.body.amenities){

            for(let el of req.body.amenities){

                const container = await RoomAmenities.findById(el);
                if (container) {
                    amenities.push(container);
                }
            }
            
        }


        //Entertainments
        let entertainments = [];
        if(req.body.entertainment){
            for(let el of req.body.entertainment){

                const container = await RoomEntertainment.findById(el);
                if (container) {
                    entertainments.push(container);
                }
            }
           
        }

        //Room services
        let roomServices = [];
        if(req.body.room_service){

           for(let el of req.body.room_service){

               const container = await RoomService.findById(el);
               if (container) {
                   console.log('room service', container);
                   roomServices.push(container);
                }
                else {
                    console.log('no room service');
                }
            }
           
        }

        //Status
        let status = await RoomStatus.findById(req.body.status);

        if(!status){
            status = room.status;
        }

        //View 
        let view = await RoomView.findById(req.body.view_type);

        if(!view){
            view = room.view_type;
        }

        //Bath
        let bath = await BathType.findById(req.body.bath_type);

        if(!bath){
            bath = room.bath_type;
        }
  
        const updateData = {
            type: roomType ,
            detail: req.body.detail ? req.body.detail : room.detail,
            price: req.body.price ? req.body.price : room.price, //number
            cost:req.body.cost?req.body.cost:room.cost,
            quota: req.body.quota ? req.body.quota : room.quota,
            unit:room.unit,
            //highlight
            size: req.body.size ? req.body.size : room.size, // number <=> sqm.
            bed_type: bedType, // id from bed type
            aircondition: airType,
            max_person: req.body.max_person ? req.body.max_person : room.max_person,
            children: req.body.children ? req.body.children : room.children, // true if no charge for children
            view_type: view ,
            bath_type: bath,
            smoke_type: req.body.smoke_type?req.body.smoke_type:room.smoke_type , // true if allow to smoke
            furniture:  furnitures, //array
            room_service: roomServices, //default room service apply to this room
            amenities: amenities ,
            // entertainment
            wifi: req.body.wifi ? req.body.wifi : room.wifi, // true if available
            entertainment: entertainments, // array
            // security
            security: security, //object of security
            // promotion
            promotions: req.body.promotions ? req.body.promotions : room.promotions, //array available for multiple promotion
            // status
            status: status, //avariable,busy,maintenance
        }
        const edit = await Room.findByIdAndUpdate(id, updateData, { returnOriginal: false })
        return res.status(200).send(edit)
    } catch (error) {
        return res.send({ message: error.message })
    }

}

//delete
module.exports.Delete = async (req, res) => {
    const id = req.params.id;
    try {

        await Room.findByIdAndDelete(id, null)
        return res.status(200).send('ลบข้อมูลห้องสำเร็จ')

    } catch (error) {
        return res.status(500).send({ message: err.message });
    }
}
