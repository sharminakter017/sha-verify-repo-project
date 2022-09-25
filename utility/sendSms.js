const twilio = require('twilio')(process.env.SID, process.env.AUTH_TOKEN);
const dotenv = require('dotenv').config()



console.log(process.env.SID);


const twilio_cell = process.env.TWILIO_CELL

//create sms
const sendSms = async (to,sms) => {

   await twilio.messages.create({
        from : twilio_cell,
        to   : to,
        body : sms
    })
    .then( res => {
        console.log('sms send successfull');
    })
    .catch( error => {
        console.log(error.message);
    })

 

}



//exporting
module.exports = sendSms;