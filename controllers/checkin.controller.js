const {Booking}= require('../models/booking.schema');
const {Partner}= require('../models/partner.schema');


//verify checked in user
module.exports.VerifyCheckedInUser = async (req,res) =>{

    try {
        
   const booking = await Booking.findOne({
    $and:[{ref_number:req.body.ref_number},{customer_tel:req.body.customer_tel}]})

        if(!booking || booking.length<=0){
            return res.status(404).send({message:'no booking found'});
        }

        const status = booking.status;

        if(status[status.length-1].name !=='จองแล้ว')  {
            return res.status(400).send({message:'This booking is not accepted'});
        }
    
 
    //send OTP
    var axios = require('axios');
    var config = {
        method: 'post',
        url: 'https://portal-otp.smsmkt.com/api/otp-send',
        headers: {
            "Content-Type":"application/json",
            "api_key":process.env.MESSAGE_API_KEY,
            "secret_key":process.env.MESSAGE_API_SECRET,
        },
        data:JSON.stringify({
            "project_key":process.env.MESSAGE_API_PROJECT_KEY,
            "phone":req.body.customer_tel,
          
        })
    };
    axios(config).then(async function (response) {
        if(response.data.code !=="000"){
            return res.send({data:response.data});
        }
        const responseData = {
            booking_id:booking._id.toString(),
            data:response.data
        }

                //end message

        return res.status(200).send(responseData)
    }).catch(function (error) {
        return res.status(500).send(error.message)
    });
} catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
}
}


//confirm checkin otp
module.exports.ConfirmCheckin = async (req,res) =>{
try {
    
    //send validated
    var axios = require('axios');
    var config = {
        method: 'post',
        url: 'https://portal-otp.smsmkt.com/api/otp-validate',
        headers: {
            "Content-Type":"application/json",
            "api_key":process.env.MESSAGE_API_KEY,
            "secret_key":process.env.MESSAGE_API_SECRET,
        },
        data:JSON.stringify({
            "token":req.body.token,
            "otp_code":req.body.otp_code,
           
        })
    };
    axios(config).then(async function (response) {
        console.log('response',response.data);
        if(response.data.detail==='OK.'){

            //update booking
            const booking = await Booking.findById(req.body.booking_id);
            if(!booking){
                console.log('nobooking');
                return;
            }
            const updateData = booking.status;
            
            updateData.push({
                name:'เช็คอิน',
                date:new Date()
            })
            console.log('updateData',updateData);
            const edit =  await Booking.findByIdAndUpdate(booking._id,{status:updateData},{returnDocument:'after'})
            //console.log('booking was updated',data);
            // callback 
            const partner = await Partner.findById(booking.partner_id);   
            if(!partner){
                return res.status(400).send({message:'Partner not found'});
            }

          const url = partner.webhook;
          const data = {
              ref_number: booking.ref_number,
              status:'checked in',
              message:'ลูกค้าเช็คอิน'
          }
          await axios.post(url,data).then((err,res)=>{}).catch(err =>{
              return true;
          })
        
        }   
        return res.status(200).send(response.data);

    }).catch(function (error) {
        console.log('catch error',error);
        return res.status(500).send(error.message);
    });


} catch (error) {
    console.log(error);
}
}

//check out
module.exports.CheckOut = async (req,res) =>{
    const booking_id = req.body.booking_id; //booking id
    try {
        const current_booking = await Booking.findById(booking_id);
        if(!current_booking){
            return res.status(404).send({message:'not found this booking id'});
        }

        //update booking collection
        let status = current_booking.status;
        
        if(status[status.length-1].name==="เช็คเอาท์"){
            return res.status(403).send({message:'This booking is already checked out'});
        }

        status.push({
            name:'เช็คเอาท์',
                date:new Date()
        })
       
        const edit = await Booking.findOneAndUpdate({_id:booking_id},{status:status},{returnDocument:'after'})
        //console.log(edit)
        const partner = await Partner.findById(current_booking.partner_id)
        if(!partner){
            return res.status(400).send({message:'Partner not found'});
        }
        var axios = require('axios');
        const url = partner.webhook;
        const data = {
            ref_number: result.ref_number,
            status:'checked out',
            message:'ลูกค้าเช็คเอาท์'
        }
        await axios.post(url,data).then((res)=>{
            //console.log({res,message:'send message successfully'})
        }).catch(err =>{
            console.log(err);
        })
        return res.status(200).send({
            _id:edit._id,
            message:'checkout successfully'
        })
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
}



//make fake checkin
module.exports.FakeCheckin = async (req, res) => {
    try {
        
         //update booking
         const booking = await Booking.findOne({ref_number:req.body.booking_id});
         if(!booking){
             console.log('nobooking');
             return;
         }
         const updateData = booking.status;
         console.log(booking);
         updateData.push({
             name:'เช็คอิน',
             date:new Date()
         })

        const edit = await Booking.findByIdAndUpdate(booking._id,{status:updateData},{returnOriginal:false})
        console.log('booking was updated',edit);
        return res.send('ok')
    } catch (error) {
        return res.status(500).send(error)
    }
}

//make fake checkout
module.exports.FakeCheckout = async (req, res) => {
    try {
         //update booking
         const booking = await Booking.findOne({ref_number:req.body.booking_id});
         if(!booking){
             console.log('nobooking');
             return;
         }
         const updateData = booking.status;
         
         updateData.push({
             name:'เช็คเอาท์',
             date:new Date()
         })
         
        const edit = await Booking.findByIdAndUpdate(booking._id,{status:updateData},{returnOriginal:false})
        console.log('booking was updated',edit)
        return res.send('ok')
    } catch (error) {
        return res.status(500).send(error)
    }
}

//make fake accept
module.exports.FakeAccept = async (req, res) => {
    try {
         //update booking
         const booking = await Booking.findOne({ref_number:req.body.booking_id});
         if(!booking){
             console.log('nobooking');
             return res.status(404).send('not found');
         }
         const updateData = booking.status;
         
         updateData.push({
             name:'จองแล้ว',
             date:new Date()
         })
         
        const edit = await Booking.findByIdAndUpdate(booking._id,{status:updateData},{returnOriginal:false})
        console.log('booking was updated',edit)
        return res.send('ok')
    } catch (error) {
        return res.status(500).send(error)
    }
}