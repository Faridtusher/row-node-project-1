// // dependencies
const http = require('http')
const environment = require('./helpers/environment')
const {handelReqRes} = require('./helpers/handelReqRes')

// scaffolding
const app ={};

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
