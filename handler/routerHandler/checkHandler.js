// dependencies
const data = require('../../lib/data')
const { parseJSON, createRandomString } = require('../../helpers/utilities')
const verification = require('./tokenHandler')
const { maxCheck } = require('../../helpers/environment')

// scaffolding
const handelRoute = {};

// create the check Route
handelRoute.checkHandler = (requestProperties, callBack) => {

   const chosenMethods = ['post', 'get', 'put', 'delete'];
   if (chosenMethods.indexOf(requestProperties.method) > -1) {
      handelRoute._check[requestProperties.method](requestProperties, callBack);
   }
   else {
      callBack(400, {
         message: 'Sorry ! this is not the right method'
      })
   }
}

// double module scaffolding
handelRoute._check = {};

// create the post
handelRoute._check.post = (requestProperties, callBack) => {
   const protocol = typeof (requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

   const url = typeof (requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

   const method = typeof (requestProperties.body.method) === 'string' && ['post', 'get', 'put', 'delete'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

   const successCode = typeof (requestProperties.body.successCode) === 'object' && requestProperties.body.successCode instanceof Array ? requestProperties.body.successCode : false;

   const timeOutSecond = typeof (requestProperties.body.timeOutSecond) === 'number' && requestProperties.body.timeOutSecond % 1 === 0 && requestProperties.body.timeOutSecond >= 1 && requestProperties.body.timeOutSecond <= 5 ? requestProperties.body.timeOutSecond : false;


   if (protocol && url && method && successCode && timeOutSecond) {
      // verify the token
      const token = typeof (requestProperties.headerObject.token) === 'string' ? requestProperties.headerObject.token : false;

      // read the file from token
      data.read('token', token, (err1, tData) => {
         if (!err1 && tData) {
            const tokenObject = parseJSON(tData)
            const userPhone = tokenObject.phone;

            // verify the token
            verification._token.verify(token, userPhone, (isTokenValid) => {
               if (isTokenValid) {
                  // read the user Data
                  data.read('user', userPhone, (err2, uData) => {
                     if (!err2 && uData) {
                        const userObject = parseJSON(uData);
                        // create the userCheck
                        const userCheck = typeof (userObject.check) === 'object' && userObject.check instanceof Array ? userObject.check : [];
                        userObject.check = userCheck;
                        const checkId = createRandomString(20)
                        const checkObject = {
                           checkId,
                           phone: userPhone,
                           protocol,
                           url,
                           method,
                           successCode,
                           timeOutSecond
                        }

                        if (userCheck.length < maxCheck) {
                           // create the check data
                           data.create('check', checkId, checkObject, (err3) => {
                              if (err3) {
                                 userCheck.push(checkId)
                                 data.update('user', userPhone, userObject, (err4) => {
                                    if (!err4) {
                                       callBack(200, userObject)
                                    }
                                    else {
                                       callBack(400, {
                                          message: 'Can not update the user data'
                                       })
                                    }
                                 })
                              }
                              else {
                                 callBack(400, {
                                    message: 'Can not create the check data'
                                 })
                              }
                           })
                        }
                        else {
                           callBack(400, {
                              message: 'Cross the check limit'
                           })
                        }
                     }
                     else {
                        callBack(400, {
                           message: 'Can not read the user data'
                        })
                     }
                  })
               }
               else {
                  callBack(400, {
                     message: 'Authentication failure'
                  })
               }
            })
         }
         else {
            callBack(400, {
               message: 'Can not read the token data'
            })
         }
      })
   }
   else {
      callBack(500, {
         message: 'Problem in your request'
      })
   }
}


// create the get
handelRoute._check.get = (requestProperties, callBack) => {
   const id = typeof (requestProperties.queryObject.id) === 'string' && requestProperties.queryObject.id.trim().length > 0 ? requestProperties.queryObject.id : false;

   if (id) {
      // read the check file
      data.read('check', id, (err1, cData) => {
         if (!err1 && cData) {
            const checkObject = parseJSON(cData);
            const checkPhone = checkObject.phone;
            const token = typeof (requestProperties.headerObject.token) === 'string' && requestProperties.headerObject.token.trim().length > 0 ? requestProperties.headerObject.token : false;
            // verify the token
            verification._token.verify(token, checkPhone, (isTokenValid) => {
               if (isTokenValid) {
                  callBack(200, checkObject)
               }
               else {
                  callBack(403, {
                     message: 'Authentication error'
                  })
               }
            })
         }
         else {
            callBack(400, {
               message: 'Can not read the check data'
            })
         }
      })
   }
   else {
      callBack(400, {
         message: 'Id is not valid'
      })
   }
}


// create the put
handelRoute._check.put = (requestProperties, callBack) => {
   const protocol = typeof (requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

   const url = typeof (requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

   const method = typeof (requestProperties.body.method) === 'string' && ['post', 'get', 'put', 'delete'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

   const successCode = typeof (requestProperties.body.successCode) === 'object' && requestProperties.body.successCode instanceof Array ? requestProperties.body.successCode : false;

   const timeOutSecond = typeof (requestProperties.body.timeOutSecond) === 'number' && requestProperties.body.timeOutSecond % 1 === 0 && requestProperties.body.timeOutSecond >= 1 && requestProperties.body.timeOutSecond <= 5 ? requestProperties.body.timeOutSecond : false;

   const id = typeof (requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length > 0 ? requestProperties.body.id : false;

   if (id) {
      if (protocol || url || method || successCode || timeOutSecond) {
         // read the check data
         data.read('check', id, (err1, cData) => {
            if (!err1 && cData) {
               const checkObject = parseJSON(cData)
               const checkPhone = checkObject.phone;
               const token = typeof (requestProperties.headerObject.token) === 'string' ? requestProperties.headerObject.token : false;

               verification._token.verify(token, checkPhone, (isTokenValid) => {
                  if (isTokenValid) {
                     if (protocol) {
                        checkObject.protocol = protocol
                     }
                     if (url) {
                        checkObject.url = url
                     }
                     if (method) {
                        checkObject.method = method
                     }
                     if (successCode) {
                        checkObject.successCode = successCode
                     }
                     if (timeOutSecond) {
                        checkObject.timeOutSecond = timeOutSecond
                     }

                     // update the check date
                     data.update('check', id, checkObject, (err3) => {
                        if (!err3) {
                           callBack(200, checkObject)
                        }
                        else {
                           callBack(400, {
                              message: 'Can not update the check data'
                           })
                        }
                     })
                  }
                  else {
                     callBack(403, {
                        message: 'Authentication failure'
                     })
                  }
               })
            }
            else {
               callBack(400, {
                  message: 'Can not read the check data'
               })
            }
         })
      }
      else {
         callBack(400, {
            message: 'There is a problem in your request'
         })
      }
   }
   else {
      callBack(400, {
         message: 'Id is not valid'
      })
   }
}


// create the delete
handelRoute._check.delete = (requestProperties, callBack) => {
   const id = typeof(requestProperties.queryObject.id) === 'string' && requestProperties.queryObject.id.trim().length === 20 ? requestProperties.queryObject.id : false;

   if(id){
      // read the check data
      data.read('check', id, (err1, cData) =>{
         if(!err1 && cData){
            const checkObject = parseJSON(cData)
            const checkPhone = checkObject.phone;
            const token = typeof(requestProperties.headerObject.token) === 'string' && requestProperties.headerObject.token.trim().length === 20 ? requestProperties.headerObject.token : false;

            verification._token.verify(token, checkPhone, (isTokenValid) =>{
               if(isTokenValid){
                  // delete the check file
                  data.delete('check', id, (err2) =>{
                     if(err2){
                        // read the user file
                        data.read('user', checkPhone, (err3 , uData) =>{
                           if(!err3 && uData){
                              const userObject = parseJSON(uData);
                              const userPhone = userObject.phone
                              const userCheck = typeof(userObject.check) === 'object' && userObject.check instanceof Array ? userObject.check : [];
                              userObject.check = userCheck;

                              const checkPosition = userCheck.indexOf(id);
                              if(checkPosition > -1){
                                 userCheck.splice(checkPosition,1)

                                 // update the user data
                                 data.update('user', userPhone, userObject, (err4) =>{
                                    if(!err4){
                                       callBack(200,userObject)
                                    }
                                    else{
                                       callBack(400,{
                                          message:'Can not update the user data'
                                       })
                                    }
                                 })
                              }
                              else{
                                 callBack(400,{
                                    message:'check position is not valid'
                                 })
                              }
                           }
                           else{
                              callBack(400,{
                                 message:'Can not read the user file'
                              })
                           }
                        })
                     }
                     else{
                        callBack(400,{
                           message:'Check data is not delete'
                        })
                     }
                  })
               }
               else{
                  callBack(403,{
                     message:'Authentication error'
                  })
               }
            })
         }
         else{
            callBack(400,{
               message:'Can nor read the check file'
            })
         }
      })
   }
   else{
      callBack(400,{
         message:'id is not valid'
      })
   }
}

// export
module.exports = handelRoute
