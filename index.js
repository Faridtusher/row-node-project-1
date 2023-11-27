// // dependencies
const http = require('http')
const environment = require('./helpers/environment')
const {handelReqRes} = require('./helpers/handelReqRes')
const data = require('./lib/data')

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

// testing
data.update('myFile', 'newFile', { Name: "Dima && Farid in sha allah husband and wife", country: "Bangladesh && jordan and palestine" }, (err) =>{
   console.log('Error was',err)  
})

data.create('test', 'newFile', { Name: " Farid", country: "Bangladesh " }, (err) => {
   console.log('Error was', err)
})

// data.delete('test', 'newFile', (err) => {
//    console.log('Error was', err)
// })

// exports
module.exports = app;
