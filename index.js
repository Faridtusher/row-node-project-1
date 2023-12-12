// // dependencies
const http = require('http')
const environment = require('./helpers/environment')
const {handelReqRes} = require('./helpers/handelReqRes')
const twilio = require('./helpers/notification')

// scaffolding
const app ={};

// do the twilio
twilio.sendMsgTwilio('01164374797', 'I love Almighty', (err) =>{
   console.log(`This is the error ${err}`)
})



// create the server
app.createServer = () =>{
   const server = http.createServer(app.handelReqRes)
   server.listen(environment.port, () =>{
      console.log(`Your server is running in ${environment.port}`)
   })
}

// handel request and response
app.handelReqRes = handelReqRes;

// run the server
app.createServer();

// exports
module.exports = app;
