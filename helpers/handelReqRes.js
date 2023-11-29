// dependencies
const url = require('url');
const {StringDecoder} = require('string_decoder')
const {routeHandler} = require('../route');
const {notFoundHandler} = require('../handler/routerHandler/notFoundHandler');
const {parseJSON} = require('../helpers/utilities')

// scaffolding
const handel = {};



// handel the request and response 
handel.handelReqRes = (req, res) =>{
   const parseUrl = url.parse(req.url, true);
   // console.log(parseUrl)
   const path = parseUrl.pathname;
   const trimPath = path.replace(/^\/+|\/+$/g,'').toLowerCase();
   const queryObject = parseUrl.query;
   const method = req.method.toLowerCase();
   const headerObject = req.headers;
   const requestProperties = {
      path,
      trimPath,
      queryObject,
      method,
      headerObject
   }

   
   const decode = new StringDecoder('utf-8')
   let realData = '';
   req.on('data', (buffer) =>{
      realData = realData + decode.write(buffer)
   })

   req.on('end', () =>{
      realData = realData + decode.end();
      requestProperties.body = parseJSON(realData);

      const chosenHandler = routeHandler[trimPath] ? routeHandler[trimPath] : notFoundHandler;
      chosenHandler(requestProperties, (statusCode, payload)=>{
         statusCode = typeof(statusCode) ==='number' ? statusCode : 500,
         payload = typeof (payload) === 'object' ? payload : {};

         const payloadString  = JSON.stringify(payload)
         res.setHeader('content-type','Application/json')
         res.writeHead(statusCode);
         res.end(payloadString)
      })
   })
}

// export
module.exports = handel