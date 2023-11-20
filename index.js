// dependencies
const http = require('http')
const {handelReqRes} = require('./helpers/handelReqRes')

// scaffolding
const app = {};

// configuration
app.config = {
   port: 9000,
}


// create the server
app.createServer = (req, res) =>{
   const server = http.createServer();
   server.listen(app.config.port, () =>{
      console.log(`Your server is running ${app.config.port}`)
   })
}

// run the server
app.createServer();

// exports
module.exports = app;
