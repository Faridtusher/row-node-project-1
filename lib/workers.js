// dependencies
const { parseJSON } = require('../helpers/utilities');
const data = require('./data')
const url = require('url')

// module scaffolding
const workers = {};

// looping data
workers.loop = () =>{
   setInterval(() =>{
      workers.gatherAllChecks();
   },600 * 1000)
}

// create the gather allCheck
workers.gatherAllChecks = () =>{
   data.list('check', (err1, checks) =>{
      if(!err1 && checks && checks.length>-1){
         // read the file
         checks.forEach(check =>{
            // console.log(check)
            data.read('check', check, (err2, cData) =>{
               if(!err2 && cData){
                  const checkData = parseJSON(cData);
                 workers.validateCheckData(checkData)
               }
               else{
                  console.log('Can not get the check file')
               }
            })
         })
      }
      else{
         console.log('Can not get the checks file')
      }
   })
}

// validate the check data
workers.validateCheckData = (checkData) =>{
   // console.log(checkData)
   let originalCheckData = checkData;
   if (checkData && checkData.checkId){
      originalCheckData.state = typeof (checkData.state) === 'string' && ['up', 'down'].indexOf(checkData.state) > -1 ? checkData.state : 'down';

      originalCheckData.lastCheckOut = typeof (checkData.lastCheckOut) === 'number' && checkData.lastCheckOut > 0 ? checkData.lastCheckOut : false;

      workers.performCheck(checkData)
      // console.log(originalCheckData)
   }
   else{
      console.log('Can not get the valid data')
   }
}


// perform the check data
workers.performCheck = (originalCheckData) => {
   // console.log(originalCheckData)
   const parseUrl = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}`, true)
   const hostname = parseUrl.hostname;
   const path = parseUrl.path
   console.log(path)

   // construct the request
   const requestDetails = {
      protocol:`${originalCheckData.protocol}:`,
      hostname,
      method:originalCheckData.method,
      path,
      timeOut : originalCheckData.timeOutSecond * 1000,
   }

   console.log(requestDetails)
   const protocolToUse = originalCheckData.protocol === 'http' ? http : https;

   const req = protocolToUse.request(requestDetails, (res) =>{
      const status = res.statusCode;
      
   })

 
   // console.log(timeOutSecond);

   // const protocolToUse = originalCheckData.protocol === 'http' ? http : https;

   // console.log(protocolToUse)
}




// create workers functionality
workers.init = () =>{
   //1. execute all the checks
   workers.gatherAllChecks();

   // 2. call the loop so that checks Continue  
   workers.loop();
}


// export
module.exports = workers;

