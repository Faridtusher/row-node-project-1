// dependencies

// module scaffolding
const handelRoute ={};

// create the check handel function
handelRoute.checkHandler = (requestProperties, callBack) =>{
   callBack(200,{
      message:'this is the check page'
   })
}

// export
module.exports = handelRoute;