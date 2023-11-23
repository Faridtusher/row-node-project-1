// dependencies

// scaffolding
const handelRoute = {};

// create token handler
handelRoute.tokenHandler = (requestProperties, callBack) =>{
   callBack(200,{
      message:'This is the token handler page'
   })
}

// exports 
module.exports = handelRoute;
