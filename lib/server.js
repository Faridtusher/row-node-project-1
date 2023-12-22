// dependencies
const http = require('http')
const environment = require('../helpers/environment')
const {handelReqRes} = require('../helpers/handelReqRes')


// module scaffolding
const server = {};


// create the server
server.buildServer = () =>{
   const createServer = http.createServer(server.runServer);
   createServer.listen(environment.port, () =>{
      console.log(`Your server is running ${environment.port}`)
   })
}

// run the server
server.runServer = handelReqRes;

// call the server
// server.buildServer();
server.init = () =>{
   server.buildServer();
}


// export
module.exports = server;

