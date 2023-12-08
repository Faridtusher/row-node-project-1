// dependencies
const { parseJSON, hash} = require('../../helpers/utilities');
const data = require('../../lib/data')
const verification = require('./tokenHandler')

// module scaffolding
const handelRoute = {};

// create the check handel function
handelRoute.userHandler = (requestProperties, callBack) => {
   const chosenMethod = ['post', 'get', 'put', 'delete'];
   if(chosenMethod.indexOf(requestProperties.method) > -1){
      handelRoute._user[requestProperties.method](requestProperties, callBack)
   }
   else{
      callBack(400,{
         message:'you are select the wrong method'
      })
   }
}

// create privet scaffolding
handelRoute._user = {};

// create the post method
handelRoute._user.post = (requestProperties , callBack) =>{
   const firstName =
      typeof requestProperties.body.firstName === 'string' &&
         requestProperties.body.firstName.trim().length > 0
         ? requestProperties.body.firstName
         : false;

   const lastName =
      typeof requestProperties.body.lastName === 'string' &&
         requestProperties.body.lastName.trim().length > 0
         ? requestProperties.body.lastName
         : false;

   const phone =
      typeof requestProperties.body.phone === 'string' &&
         requestProperties.body.phone.trim().length === 11
         ? requestProperties.body.phone
         : false;

   const password =
      typeof requestProperties.body.password === 'string' &&
         requestProperties.body.password.trim().length > 0
         ? requestProperties.body.password
         : false;

   const tosAgreement =
      typeof requestProperties.body.tosAgreement === 'boolean' &&
         requestProperties.body.tosAgreement
         ? requestProperties.body.tosAgreement
         : false;

   if (firstName && lastName && phone && password && tosAgreement) {
   //   read the user data
   data.read('user', phone, (err1) =>{
      if(err1){
         const userProperties = {
            firstName,
            lastName,
            phone,
            password : hash(password),
            tosAgreement
         }
         
         // create the file
         data.create('user', phone, userProperties, (err2) =>{
            if(err2){
               callBack(200,{
                  message:'User create successfully'
               })
            }
            else{
               callBack(400,{
                  message:'User do not create'
               })
            }
         })
      }
      else{
         callBack(400,{
            message:'This phone is already exist'
         })
      }
   })
   }
   else {
      callBack(400, {
         message: 'user data is not valid'
      })
   }
}

// create the get method
handelRoute._user.get = (requestProperties, callBack) =>{
   const phone = typeof (requestProperties.queryObject.phone) === 'string' && requestProperties.queryObject.phone.trim().length === 11 ? requestProperties.queryObject.phone : false

   if(phone){
      // read the data
      const token = typeof(requestProperties.headerObject.token) === 'string' ? requestProperties.headerObject.token : false;
      verification._token.verify(token, phone, (isTokenValid) =>{
         if(isTokenValid){
            data.read('user', phone, (err1, uData) => {
               if (!err1 && uData) {
                  const userData = parseJSON(uData);
                  delete userData.password
                  callBack(200, userData)
               }
               else {
                  callBack(400, {
                     message: 'can not read the file'
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
         message:'Phone is not valid'
      })
   }
}


// create the put method
handelRoute._user.put = (requestProperties, callBack) => {

   const firstName =
      typeof requestProperties.body.firstName === 'string' &&
         requestProperties.body.firstName.trim().length > 0
         ? requestProperties.body.firstName
         : false;

   const lastName =
      typeof requestProperties.body.lastName === 'string' &&
         requestProperties.body.lastName.trim().length > 0
         ? requestProperties.body.lastName
         : false;

   const phone =
      typeof requestProperties.body.phone === 'string' &&
         requestProperties.body.phone.trim().length === 11
         ? requestProperties.body.phone
         : false;

   const password =
      typeof requestProperties.body.password === 'string' &&
         requestProperties.body.password.trim().length > 0
         ? requestProperties.body.password
         : false;

   if(phone){
      const token = typeof(requestProperties.headerObject.token) === 'string' ? requestProperties.headerObject.token : false;

      // check the verification
      verification._token.verify(token, phone, (isTokenValid) =>{
         if(isTokenValid){
            // read the file
            data.read('user', phone, (err1 , uData) =>{
               if(!err1 && uData){
                  const userData = parseJSON(uData);
                  
                 if(firstName || lastName || password){
                  if(firstName){
                     userData.firstName = firstName
                  }
                  if(lastName){
                     userData.lastName = lastName
                  }
                  if(password){
                     userData.password = hash(password)
                  }
                 }

               

               //   update the data
               data.update('user', phone, userData, (err2) =>{
                  if(!err2){
                     callBack(200,{
                        message:'Successfully update'
                     })
                  }
                  else{
                     callBack(400,{
                        message:'Not update'
                     })
                  }
               })
               }
               else{
                  callBack(400,{
                     message:'Can not read the token data'
                  })
               }
            })
         }
         else{
            callBack(400,{
               message:'Authentication error'
            })
         }
      })

   }else{
      callBack(405,{
         message:'invalid number'
      })
   }    
}


// create the delete method
handelRoute._user.delete = (requestProperties, callBack) => {

   const phone = typeof (requestProperties.queryObject.phone) === 'string' && requestProperties.queryObject.phone.trim().length === 11 ? requestProperties.queryObject.phone : false

   if(phone){
      const token = typeof(requestProperties.headerObject.token) === 'string' ? requestProperties.headerObject.token : false;

      // verify the token
      verification._token.verify(token, phone, (isTokenValid) =>{
         if(isTokenValid){
            // read the file
            data.read('user', phone, (err1) =>{
               if(!err1){
                  // delete the file
                  data.delete('user', phone, (err2) =>{
                     if(err2){
                        callBack(200,{
                           message:'User was successfully delete'
                        })
                     }
                     else{
                        callBack(400,{
                           message:'User was not deleted'
                        })
                     }
                  })
               }
               else{
                  callBack(404,{
                     message:'Can not read the file'
                  })
               }
            })
         }
         else{
            callBack(400,{
               message:'Authentication failure'
            })
         }
      })  
   }
   else{
      callBack(400,{
         message:'Your phone number is not valid'
      })
   }
}


// export
module.exports = handelRoute;