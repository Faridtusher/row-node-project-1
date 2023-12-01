// dependencies
const data = require('../../lib/data')
const {parseJSON, hash, createRandomString} = require('../../helpers/utilities')

// scaffolding
const handelRoute = {};

// create token handler
handelRoute.tokenHandler = (requestProperties, callBack) =>{
  const selectedMethod = ['post', 'get', 'put', 'delete']
  if(selectedMethod.indexOf(requestProperties.method) > -1){
   handelRoute._token[requestProperties.method](requestProperties,callBack)
  }

  else{
   callBack(500,{
      message:'Your selected method is not correct'
   })
  }
}

// secure the token scaffolding
handelRoute._token = {};

// handel the post me
handelRoute._token.post = (requestProperties, callBack) =>{
  const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

   const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

   if(phone && password){
      data.read('user', phone, (err1, uData) =>{
         if(!err1 && uData){
            const userData = parseJSON(uData);
            const userPassword = userData.password;
            if (userPassword === hash(password)) {
               const tokenId = createRandomString(20);
               const expires = Date.now() * 60 * 60 * 60 *1000;

               const tokenData = {
                  phone,
                  id:tokenId,
                  expires
               }
               // create the data
               data.create('token', tokenId, tokenData, (err2) =>{
                  if(err2){
                     callBack(200,tokenData)
                  }
                  else{
                     callBack(500,{
                        message:'can not create the file'
                     })
                  }
               })
            }
            else {
               callBack(400, {
                  message: 'password is not matched'
               })
            }
         }
         else{
            callBack(400,{
               message:'Not get the user data'
            })
         }
      })
   }
   else{
      callBack(400,{
         message:'Phone number or password is not valid'
      })
   }

}

// handel the get method
handelRoute._token.get = (requestProperties, callBack) =>{
   const id = typeof(requestProperties.queryObject.id) === 'string' && requestProperties.queryObject.id.trim().length === 20 ? requestProperties.queryObject.id : false;

   if(id){
      data.read('token', id, (err1, tData) =>{
         const tokenData = parseJSON(tData);
 
         if(!err1 && tokenData){
            callBack(200, tokenData)
         }
         else{
            callBack(400,{
               message:'Id is not valid'
            })
         }
      })
   }
   else{
      callBack(400,{
         message:'The char of id is not valid'
      })
   }
}

// handel the put method
handelRoute._token.put = (requestProperties, callBack) => {
   const id = typeof (requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;

   if(id){
      // read the file
      data.read('token', id, (err1 , tData) =>{
         const tokenData = parseJSON(tData)
         let tokenExpire = tokenData.expires;

         if(!err1 && tokenData){
            if (tokenExpire > Date.now()) {
               tokenData.expires = Date.now() + 60 * 60 * 1000;

               data.update('token', id, tokenData, (err2) => {
                  if (!err2) {
                     callBack(200, {
                        message: 'good'
                     })
                  }
                  else {
                     callBack(500, {
                        message: 'Date is not update'
                     })
                  }
               })
            }
            else {
               callBack(500, {
                  message: 'Expire the time'
               })
            }  
         }
         else{
            callBack(405,{
               message:'Data is not valid'
            })
         }
         
         
      })
   }
   else{
      callBack(400,{
         message:'The digit of id is not valid'
      })
   }
}

// handel the delete method
handelRoute._token.delete = (requestProperties, callBack) => {
   const id = typeof (requestProperties.queryObject.id) === 'string' && requestProperties.queryObject.id.trim().length === 20 ? requestProperties.queryObject.id : false;

   if(id){
      // read the file
      data.read('token', id, (err1) =>{
         if(!err1){
            data.delete('token', id, (err2) => {
               if (err2) {
                  callBack(200, {
                     message: 'User was successfully delete'
                  })
               }
               else {
                  callBack(400, {
                     message: 'not delete'
                  })
               }
            })
         }
         else{
            callBack(400,{
               message:'Token id is not valid'
            })
         }
      })
   }
   else{
      callBack(400,{
         message:'token dight is not valid'
      })
   }
}

// verify the token
handelRoute._token.verify = (id, phone, callBack) =>{
   // read the file
   data.read('token', id, (err, tData) =>{
      if(!err && tData){
         const tokenData = parseJSON(tData)
         if(tokenData.phone === phone && tokenData.expires > Date.now()){
            callBack(true)
         }
         else{
            callBack(false)
         }
      }
      else{
         callBack(false)
      }
   })
}

// exports 
module.exports = handelRoute;
