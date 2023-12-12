// dependencies
const  https = require('https')
const {twilio} = require('./environment');

// module scaffolding
const notification = {};

// send the message by twilio
notification.sendMsgTwilio = (phone, msg, callback) =>{
   const userPhone = typeof(phone) === 'string' && phone.trim().length === 11 ? phone : false;
   const userMsg = typeof(msg) === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg: false;

   if(userPhone && userMsg){
      const payload = {
         From: twilio.fromPhone,
         To: `+88${userPhone}`,
         Body: `${userMsg}`
      }

      // stringify the payload
      const payLoadString = JSON.stringify(payload);

      // create the twilio request object
      const requestDetails = {
         hostname: 'www.twilio.com',
         method: 'put',
         path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
         auth: `${twilio.accountSid}:${twilio.authToken}`,
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
         }
      }

      // create http request
      const req = https.request(requestDetails, (res) => {
         const status = res.statusCode;
         if (status === 200 || status === 201) {
            callback(false)
         }
         else {
            callback(status)
         }
      })

      req.on('error', (e) => {
         callback(e)
      })

      req.write(payLoadString);
      req.end();
   }

   else{
      callback('User data is not valid')
   }
}

// export
module.exports = notification;






