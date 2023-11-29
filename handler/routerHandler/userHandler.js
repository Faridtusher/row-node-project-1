// dependencies
const { parseJSON } = require('../../helpers/utilities');
const data = require('../../lib/data')

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
            password,
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
      data.read('user', phone, (err1, uData) =>{
         if(!err1 && uData){
            const userData = parseJSON(uData);
            delete userData.password 
            callBack(200, userData)
         }
         else{
            callBack(400,{
               message:'can not read the file'
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
      data.read('user', phone, (err1, uData) =>{
         const userData = parseJSON(uData)
         if(!err1){
            if(firstName || lastName || password){
               if(firstName){
                  userData.firstName = firstName
               }
               if (lastName) {
                  userData.lastName = lastName
               }
               if (password) {
                  userData.password = password
               }

               // update the file
               data.update('user', phone, userData, (err3) =>{
                  if(err3){
                     callBack(200,{
                        message:'user update successfully'
                     })
                  }
                  else{
                     callBack(500,{
                        message:'user do not update successfully'
                     })
                  }
               })
            }
            else{
               callBack(500,{
                  message:'not get the valid info'
               })
            }
         }
         else{
            callBack(500,{
               message:'can not get the phone number'
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

      data.read('user', phone, (err1) =>{
         if(!err1){
            data.delete('user', phone, (err2) =>{
               if(err2){
                  callBack(200,{
                     message:'phone number is deleted successfully'
                  })
               }
               else{
                  callBack(400,{
                     message:'Do not delete the file'
                  })
               }
            })
         }
         else{
            callBack(405,{
               message:'This phone no is not in the database'
            })
         }
      })
   }else{
      callBack(500,{
         message:'phone number is not valid'
      })
   }
}


// export
module.exports = handelRoute;