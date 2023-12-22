// // dependencies
const server = require('./lib/server')
const worker = require('./lib/workers')

// scaffolding
const app = {};

// create the server
app.init = () =>{
   server.init();

   worker.init();

}

// run the app
app.init();

// exports
module.exports = app;
